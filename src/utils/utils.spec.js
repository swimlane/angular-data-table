import { ObjectId } from './utils';

describe('utils', function() {
	it('should generate unique ID', () => {
		var id1 = ObjectId();
		var id2 = ObjectId();

		expect(id1).not.toBe(id2);
	});
});
