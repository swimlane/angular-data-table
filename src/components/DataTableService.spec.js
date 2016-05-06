import '../tests/frameworks';
import {ObjectId} from '../utils/utils';
import {DataTableService} from './DataTableService';

var mock = angular.mock;

describe('DataTableService', function () {
	before(() => {
		angular.module('DataTables.Mock', []);
	})
	beforeEach(mock.module('DataTables.Mock'));

	beforeEach(mock.module(($provide) => {
		$provide.constant('DataTableService', DataTableService);
	}));

	beforeEach(mock.inject((DataTableService, $parse) => {
		this.DataTableService = DataTableService;
		this.$parse = $parse;
	}));

	it('should build and save columns', () => {
		let id = ObjectId();
		let columnElements = [
			`<column name="Name" width="300" flex-grow="1"></column>`,
			`<column name="Gender" flex-grow="1">{{monkey}} ---- {{$cell}}</column>`
		].map((el) => angular.element(el)[0]);

		this.DataTableService.saveColumns(id, columnElements);
		this.DataTableService.buildColumns({}, this.$parse);

		this.DataTableService.columns.should.have.property(id).and.have.length(2);
	});

});
