<?php
use Illuminate\Support\Facades\Schedule;

Schedule::command('rappel:prises')->everyThirtyMinutes();
Schedule::command('alerte:stock')->dailyAt('08:00');
Schedule::command('rappel:ordonnances')->dailyAt('09:00');