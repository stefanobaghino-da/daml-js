// Copyright (c) 2019 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import {assert, expect} from 'chai';
import * as sinon from 'sinon';
import {SetTimeRequest} from "../../src/model/SetTimeRequest";
import {NodeJsTimeClient} from "../../src/client/NodeJsTimeClient";
import {ValidationTree} from "../../src/validation/Validation";
import {JSONReporter} from "../../src/reporting/JSONReporter";
import {
    GetTimeRequest as PbGetTimeRequest,
    SetTimeRequest as PbSetTimeRequest
} from "../../src/generated/com/digitalasset/ledger/api/v1/testing/time_service_pb";
import {DummyTimeServiceClient} from "./DummyTimeServiceClient";

describe('NodeJsTimeClient', () => {

    const ledgerId = 'cafebabe';
    const latestRequestSpy = sinon.spy();
    const dummy = new DummyTimeServiceClient(latestRequestSpy);
    const client = new NodeJsTimeClient(ledgerId, dummy, JSONReporter);

    const setTimeRequest: SetTimeRequest = {
        currentTime: {seconds: 4, nanoseconds: 1},
        newTime: {seconds: 5, nanoseconds: 2}
    };

    const invalidRequest = {
        currentTime: {seconds: 3, nanoseconds: '0'},
        newTime: {seconds: 4, nanoseconds: 0}
    };

    const expectedValidationTree: ValidationTree = {
        errors: [],
        children: {
            currentTime: {
                errors: [],
                children: {
                    seconds: {
                        errors: [],
                        children: {}
                    },
                    nanoseconds: {
                        errors: [{
                            errorType: 'type-error',
                            expectedType: 'number',
                            actualType: 'string'
                        }],
                        children: {}
                    }
                }
            },
            newTime: {
                errors: [],
                children: {
                    seconds: {
                        errors: [],
                        children: {}
                    },
                    nanoseconds: {
                        errors: [],
                        children: {}
                    }
                }
            }
        }
    };

    afterEach(() => {
        sinon.restore();
        latestRequestSpy.resetHistory();
    });

    it('should send the request with correct ledger identifier, current and new time', (done) => {

        client.setTime(setTimeRequest, (error, _) => {
            expect(error).to.be.null;
            assert(latestRequestSpy.calledOnce);
            expect(latestRequestSpy.lastCall.args).to.have.length(1);
            expect(latestRequestSpy.lastCall.lastArg).to.be.an.instanceof(PbSetTimeRequest);
            const spiedRequest = latestRequestSpy.lastCall.lastArg as PbSetTimeRequest;
            expect(spiedRequest.getLedgerId()).to.equal(ledgerId);
            expect(spiedRequest.getCurrentTime()!.getSeconds()).to.equal(4);
            expect(spiedRequest.getCurrentTime()!.getNanos()).to.equal(1);
            expect(spiedRequest.getNewTime()!.getSeconds()).to.equal(5);
            expect(spiedRequest.getNewTime()!.getNanos()).to.equal(2);
            done();
        });

    });

    it('should send the request with correct ledger identifier, current and new time (promisified)', async () => {

        await client.setTime(setTimeRequest);
        assert(latestRequestSpy.calledOnce);
        expect(latestRequestSpy.lastCall.args).to.have.length(1);
        expect(latestRequestSpy.lastCall.lastArg).to.be.an.instanceof(PbSetTimeRequest);
        const spiedRequest = latestRequestSpy.lastCall.lastArg as PbSetTimeRequest;
        expect(spiedRequest.getLedgerId()).to.equal(ledgerId);
        expect(spiedRequest.getCurrentTime()!.getSeconds()).to.equal(4);
        expect(spiedRequest.getCurrentTime()!.getNanos()).to.equal(1);
        expect(spiedRequest.getNewTime()!.getSeconds()).to.equal(5);
        expect(spiedRequest.getNewTime()!.getNanos()).to.equal(2);

    });

    it('should forward the request for the time stream with the correct ledger identifier', (done) => {

        const call = client.getTime();
        call.on('end', () => {
            assert(latestRequestSpy.calledOnce, 'The latestRequestSpy has not been called exactly once');
            expect(latestRequestSpy.lastCall.args).to.have.length(1);
            expect(latestRequestSpy.lastCall.lastArg).to.be.instanceof(PbGetTimeRequest);
            const spiedRequest = latestRequestSpy.lastCall.lastArg as PbGetTimeRequest;
            expect(spiedRequest.getLedgerId()).to.equal(ledgerId);
            done();
        });
        call.on('error', (error) => {
            done(error);
        });

    });

    it('should perform validation on the SetTime endpoint', (done) => {

        client.setTime(invalidRequest as any as SetTimeRequest, error => {
            expect(error).to.not.be.null;
            expect(JSON.parse(error!.message)).to.deep.equal(expectedValidationTree);
            done();
        });

    });

    it('should perform validation on the SetTime endpoint (promisified)', async () => {
        let errorThrown = false;
        try {
            await client.setTime(invalidRequest as unknown as SetTimeRequest);
        } catch (error) {
            expect(error).to.not.be.null;
            expect(JSON.parse(error.message)).to.deep.equal(expectedValidationTree);
            errorThrown = true;
        }
        assert(errorThrown, 'an error was expected but none has been thrown');
    });

});