::@echo off
:: Run with seeds know to be an issue
set seeds=1672628407^
 522695140^
 77784356^
 2031559346^
 1376411800^
 2095524736^
 2064386951^
 1014793567^
 1266185634^
 1086785288^
 1148275517^
 364344693^
	
	
(for %%a in (%seeds%) do ( 
   node haggle.js --force --seed=%%a maximize.js maximize.js
))

:: Comments about the seeds
::
:: 1672628407 - 10 for both, optimal solution
:: 522695140 - with optimization - 7 each
:: 77784356 - 7:5 was a stale mate at first
:: 2031559346 - 7:5, 6 items in total
:: 1376411800 - 7:4
:: 2095524736 - 7:6
:: 2064386951 - both should get 7
:: 1014793567 - both should get 6
:: 1266185634 - 8:6
:: 1086785288 - both 6
:: 1148275517 - 7:1 or 3:9
:: 364344693 - both should get 6