import { ObjectId } from '../utils/utils';
import { DataTableService } from './DataTableService';

describe('DataTableService', function () {
	beforeEach(() => {
		angular.module('DataTables.Mock', []);
		angular.mock.module('DataTables.Mock');
		angular.mock.module(($provide) => {
			$provide.constant('DataTableService', DataTableService);
		});
		angular.mock.inject((DataTableService, $parse) => {
			this.DataTableService = DataTableService;
			this.$parse = $parse;
		});
	});

	it('should build and save columns', () => {
		let id = ObjectId(),
			columnElements = [
				'<column name="Name" width="300" flex-grow="1"></column>',
				'<column name="Gender" flex-grow="1">{{monkey}} ---- {{$cell}}</column>'
			].map((el) => angular.element(el)[0]);

		this.DataTableService.saveColumns(id, columnElements);
		this.DataTableService.buildColumns({}, this.$parse);

		expect(this.DataTableService.columns[id]).toBeDefined();
		expect(this.DataTableService.columns[id].length).toBe(2);
	});

});
