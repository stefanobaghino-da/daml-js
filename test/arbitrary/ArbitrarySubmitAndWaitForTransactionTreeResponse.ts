// Copyright (c) 2019 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import * as jsc from 'jsverify';
import {ArbitraryTransactionTree} from './ArbitraryTransactionTree';
import {SubmitAndWaitForTransactionTreeResponse} from "../../src/model/SubmitAndWaitForTransactionTreeResponse";

export const ArbitrarySubmitAndWaitForTransactionTreeResponse: jsc.Arbitrary<SubmitAndWaitForTransactionTreeResponse> =
    jsc.record({
        transaction: ArbitraryTransactionTree
    });
