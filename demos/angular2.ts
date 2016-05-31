import * as angular from 'angular';

import 'reflect-metadata';
import { Component } from '@angular/core';
import { UpgradeAdapter } from '@angular/upgrade';

import dataTable from 'dataTable';

// Setup a new adapter
var upgradeAdapter = new UpgradeAdapter();
var upgradedTable = upgradeAdapter.upgradeNg1Component('dtable');

@Component({
    selector: 'app',
    template: `
		<dtable 
			[options]="options" 
			[rows]="data" 
			class="material">
		</dtable>
	`,
    directives:[ upgradedTable ]
})
class MyDemoApp {

	options: any = {
		rowHeight: 50,
		headerHeight: 50,
		footerHeight: false,
		scrollbarV: false,
		selectable: false,
		columns: [
			{ name: "Name", width: 300 },
			{ name: "Gender" },
			{ name: "Company" }
		]
	};
	
	data: any = [
		{
			"name": "Ethel Price",
			"gender": "female",
			"company": "Enersol"
		}
	];

}

var appComponent = upgradeAdapter.downgradeNg2Component(MyDemoApp);

let appModule = angular.module('app', [ dataTable.name ]);
appModule.directive('app', appComponent);

upgradeAdapter.bootstrap(document.body, [ appModule.name ]);
