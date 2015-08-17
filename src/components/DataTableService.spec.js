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
		$provide.factory('DataTableService', DataTableService);
	}));

	beforeEach(mock.inject((DataTableService) => {
		this.DataTableService = DataTableService;
	}));

	it('should build and save columns', () => {
		let id = ObjectId();
		let columnElements = [
			angular.element(`<column name="Name" width="300" flex-grow="1"></column>`)[0],
			angular.element(`<column name="Gender" flex-grow="1">{{monkey}} ---- {{$cell}}</column>`)[0]
		];
		this.DataTableService.buildAndSaveColumns(id, columnElements);
		this.DataTableService.columns.should.have.property(id).and.have.length(2);
	});

});
