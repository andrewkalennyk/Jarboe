<?php

namespace Yaro\Jarboe;

use Yaro\Jarboe\Helpers\URLify;
use Yaro\Jarboe\NavigationMenu;
use Yaro\Jarboe\DefinitionMaker;
use Yaro\Jarboe\TreeController;
use Yaro\Jarboe\Exceptions\JarboeValidationException;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\DB;
use Yandex\Translate\Translator;
use Yandex\Translate\Exception;


class Jarboe 
{

    protected $controller;
    protected $default;

    protected function onInit($options)
    {
        $this->controller = new JarboeController($options);

        $this->default = array(
            'pagination' => Config::get('view.pagination'),
            'fetch' => Config::get('database.fetch')
        );
        Config::set('view.pagination', 'admin::tb.pagination');
        Config::set('database.fetch', \PDO::FETCH_ASSOC);
    } // end onInit

    protected function onFinish()
    {
        Config::set('view.pagination', $this->default['pagination']);
        Config::set('database.fetch', $this->default['fetch']);
    } // end onFinish

    public function table($options)
    {
        $this->onInit($options);
        DB::beginTransaction();

        try {
            $result = $this->controller->handle();
        } catch (JarboeValidationException $e) {
            DB::rollback();

            $data = array(
                'status' => false,
                'errors' => explode('|', $e->getMessage())
            );
            return Response::json($data);
        }

        DB::commit();
        $this->onFinish();

        return $result;
    } // end table
    
    /*
     * @deprecated
     */
    public function create($options)
    {
        return $this->table($options);
    } // end create

    public function fetchNavigation()
    {
        $menu = new NavigationMenu();

        return $menu->fetch();
    } // end fetchNavigation
    
    public function createDefinition($table)
    {
        $maker = new DefinitionMaker($table);

        return $maker->create();
    } // end createDefinition

    public function fetchInformer()
    {
        $menu = new Informer();

        return $menu->fetch();
    } // end fetchInformer

    public function checkNavigationPermissions()
    {
        $menu = new NavigationMenu();
        $menu->checkPermissions();
    } // end checkNavigationPermissions

    public function urlify($string)
    {
        return URLify::filter($string);
    } // end urlify

    public function translate($text, $language, $isHtml = false, $options = 0)
    {
        $key = Config::get('jarboe::translate.yandex_api_translation_key');
        if (!$key) {
            throw new \RuntimeException('Yandex api key for translations is not set');
        }

        $translator = new Translator($key);
        $translation = $translator->translate($text, $language, $isHtml, $options);

        // FIXME:
        return $translation->__toString();
    } // end translate

    public function tree($model = 'Yaro\Jarboe\Tree', $options = array())
    {
        $controller = new TreeCatalogController($model, $options);

        return $controller;
    } // end tree

    public function fileManager($connectorUrl = false)
    {
        $ident = str_random(12);
        $connectorUrl = $connectorUrl ? $connectorUrl : '/tb/elfinder/connector';
        $connector = \Config::get('jarboe::admin.uri') . $connectorUrl;

        return \View::make('admin::file_manager.common', compact('ident', 'connector'))->render();
    } // end fileManager

    public static function geo($ip = false)
    {
        if (!$ip) {
            $ip = \Request::getClientIp();
        }

        if ($ip == '127.0.0.1') {
            // HACK:
            $ip = '217.27.152.26';
        }

        $info = \DB::table('ip_geo_locations')->where('ip', $ip)->first();
        if ($info) {
            unset($info['id']);
            return $info;
        }

        $url = 'http://geoip.elib.ru/cgi-bin/getdata.pl?fmt=json&ip=';
        $json = file_get_contents($url . $ip);

        $info = json_decode($json, true);
        if (!$json || isset($info[$ip]['Error'])) {
            return false;
        }

        $data = array(
            'ip'        => $ip,
            'town'      => $info[$ip]['Town'],
            'latitude'  => $info[$ip]['Lat'],
            'longitude' => $info[$ip]['Lon'],
        );
        \DB::table('ip_geo_locations')->insert($data);

        return $data;
    } // end geo

}

