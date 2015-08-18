import '../tests/frameworks';

import {ObjectId} from './utils';

describe('utils', function () {
	it('should generate unique ID', () => {
		var id1 = ObjectId();
		var id2 = ObjectId();

		id1.should.not.eq(id2);
	});
});
