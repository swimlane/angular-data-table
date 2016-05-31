var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", 'angular', '@angular/core', '@angular/upgrade', 'dataTable', 'reflect-metadata'], function (require, exports, angular, core_1, upgrade_1, dataTable_1) {
    "use strict";
    // Setup a new adapter
    var upgradeAdapter = new upgrade_1.UpgradeAdapter();
    var upgradedTable = upgradeAdapter.upgradeNg1Component('dtable');
    var MyDemoApp = (function () {
        function MyDemoApp() {
            this.options = {
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
            this.data = [
                {
                    "name": "Ethel Price",
                    "gender": "female",
                    "company": "Enersol"
                }
            ];
        }
        MyDemoApp = __decorate([
            core_1.Component({
                selector: 'app',
                template: "\n\t\t<div>\n\t\t\t<h2>Table</h2>\n\t\t\t<dtable \n\t\t\t\t[options]=\"options\" \n\t\t\t\t[rows]=\"data\" \n\t\t\t\tclass=\"material\">\n\t\t\t</dtable>\n\t\t\t\n\t\t\t<h2>Options</h2>\n\t\t\t<pre>\n\t\t\t{{options}}\n\t\t\t</pre>\n\t\t</div>\n\t",
                directives: [upgradedTable]
            })
        ], MyDemoApp);
        return MyDemoApp;
    }());
    var appComponent = upgradeAdapter.downgradeNg2Component(MyDemoApp);
    var appModule = angular.module('app', [dataTable_1.default.name]);
    appModule.directive('app', appComponent);
    upgradeAdapter.bootstrap(document.body, [appModule.name]);
});
