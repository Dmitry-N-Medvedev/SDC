import mocha from 'mocha';
import chai from 'chai';
import {
  QueryParameterNames,
} from '../src/constants/QueryParameterNames';

const {
  describe,
  it,
} = mocha;
const {
  expect,
} = chai;

describe('libCommon', () => {
  it('should verify the contents of the QueryParameterNames', async () => {
    expect(QueryParameterNames.HEADING).to.equal('heading');
    expect(QueryParameterNames.TARGET).to.equal('target');
  });
});
