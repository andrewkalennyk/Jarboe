<?php

namespace Yaro\Jarboe\Observers;


use Yaro\Jarboe\Interfaces\IObserver;
use Yaro\Jarboe\Interfaces\IObservable;


class EventsObserver implements IObserver
{

	public function update(IObservable $observable)
	{
		$event = $observable->getEvent();
		$event->save();
	}
}
