// Copyright (c) 2019 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import {Commands} from "../model/Commands";
import {Commands as PbCommands} from "../generated/com/digitalasset/ledger/api/v1/commands_pb";
import {Codec} from "./Codec";
import {CommandCodec} from "./CommandCodec";
import {TimestampCodec} from "./TimestampCodec";

export const CommandsCodec: Codec<PbCommands, Commands> = {
    deserialize(commands: PbCommands): Commands {
        const result: Commands = {
            applicationId: commands.getApplicationId(),
            commandId: commands.getCommandId(),
            party: commands.getParty(),
            ledgerEffectiveTime: TimestampCodec.deserialize(commands.getLedgerEffectiveTime()!),
            maximumRecordTime: TimestampCodec.deserialize(commands.getMaximumRecordTime()!),
            list: commands.getCommandsList().map((command) => CommandCodec.deserialize(command))
        };
        const workflowId = commands.getWorkflowId();
        if (workflowId !== undefined && workflowId !== '') {
            result.workflowId = workflowId;
        }
        return result;
    },
    serialize(commands: Commands): PbCommands {
        const result = new PbCommands();
        result.setCommandId(commands.commandId);
        result.setParty(commands.party);
        result.setLedgerEffectiveTime(TimestampCodec.serialize(commands.ledgerEffectiveTime));
        result.setMaximumRecordTime(TimestampCodec.serialize(commands.maximumRecordTime));
        result.setCommandsList(commands.list.map((command) => CommandCodec.serialize(command)));
        if (commands.workflowId) {
            result.setWorkflowId(commands.workflowId);
        }
        if (commands.applicationId) {
            result.setApplicationId(commands.applicationId);
        }
        return result;
    }
};