import 'babel-core/polyfill';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
chai.use(sinonChai);

chai.should();

let expect = chai.expect;

export default chai;
export {expect, sinon};
