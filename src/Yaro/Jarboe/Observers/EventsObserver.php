<?php

namespace Yaro\Jarboe\Observers;


use Yaro\Jarboe\Interfaces\IObserver;
use Yaro\Jarboe\Interfaces\IObservable;


class EventsLogger implements IObserver
{

	/*
	private $idUser;
	private $ip;
	private $action;
	private $entityTable;
	private $idEntity;
	private $info;
	*/

	public function update(IObservable $observable)
	{
		$this->doLog();
	}

	private function doLog()
	{
		// todo: implement
	}
}
