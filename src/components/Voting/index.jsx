import { useProjectTranslation } from '../../helpers/translations';
import React, { useContext, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import { AuthenticateContext } from '../../context/Auth';
import Proposals from './Proposals';
import Vote from './Vote';
import { formatTimestamp } from '../../helpers/staking';

export default function Voting(props) {
    const [t, i18n, ns] = useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    const nowTimestamp = new BigNumber(Date.now())
    const infoVoting = {
        'globalVotingRound': new BigNumber(0),
        'totalSupply': new BigNumber(0),
        'PRE_VOTE_MIN_TO_WIN': new BigNumber(0),
        'PRE_VOTE_MIN_PCT_TO_WIN': new BigNumber(0),
        'MIN_PCT_FOR_QUORUM': new BigNumber(0),
        'MIN_FOR_QUORUM': new BigNumber(0),
        'MIN_STAKE': new BigNumber(0),
        'VOTING_POWER': new BigNumber(0),
        'VOTE_MIN_PCT_TO_VETO': new BigNumber(0),
        'VOTE_MIN_TO_VETO': new BigNumber(0),
        'proposals': [],
        'state': 0,
        'readyToPreVoteStep': 0,
        'readyToVoteStep': 0,
        'votingData': {
            'winnerProposal': '',
            'inFavorVotes': new BigNumber(0),
            'againstVotes': new BigNumber(0),
            'votingExpirationTime': new BigNumber(0),
            'expired': true,
            'totalVotedPCT': new BigNumber(0),
            'totalVoted': new BigNumber(0)
        },
        'votingInfo': {
            'winnerProposal': '',
            'inFavorVotes': new BigNumber(0),
            'againstVotes': new BigNumber(0),
        }
    }

    if (auth.contractStatusData) {
        infoVoting['proposals'] = auth.contractStatusData.votingmachine.getProposalByIndex;
        infoVoting['state'] = new BigNumber(auth.contractStatusData.votingmachine.getState).toNumber();
        infoVoting['readyToPreVoteStep'] = new BigNumber(auth.contractStatusData.votingmachine.readyToPreVoteStep).toNumber();
        infoVoting['readyToVoteStep'] = new BigNumber(auth.contractStatusData.votingmachine.readyToVoteStep).toNumber();
        infoVoting['globalVotingRound'] = new BigNumber(
            auth.contractStatusData.votingmachine.getVotingRound
        );
        infoVoting['totalSupply'] = new BigNumber(
            Web3.utils.fromWei(
                auth.contractStatusData.votingmachine.totalSupply,
                'ether'
            )
        );
        infoVoting['PRE_VOTE_MIN_PCT_TO_WIN'] = auth.contractStatusData.votingmachine.PRE_VOTE_MIN_PCT_TO_WIN
        infoVoting['PRE_VOTE_MIN_TO_WIN'] = new BigNumber(infoVoting['totalSupply'])
            .times(new BigNumber(infoVoting['PRE_VOTE_MIN_PCT_TO_WIN']))
            .div(100);
        infoVoting['MIN_STAKE'] = auth.contractStatusData.votingmachine.MIN_STAKE
        infoVoting['MIN_PCT_FOR_QUORUM'] = auth.contractStatusData.votingmachine.MIN_PCT_FOR_QUORUM
        infoVoting['MIN_FOR_QUORUM'] = new BigNumber(infoVoting['totalSupply'])
            .times(new BigNumber(infoVoting['MIN_PCT_FOR_QUORUM']))
            .div(100);
        infoVoting['VOTE_MIN_PCT_TO_VETO'] = auth.contractStatusData.votingmachine.VOTE_MIN_PCT_TO_VETO
        infoVoting['VOTE_MIN_TO_VETO'] = new BigNumber(infoVoting['totalSupply'])
            .times(new BigNumber(infoVoting['VOTE_MIN_PCT_TO_VETO']))
            .div(100);

        // Voting Data
        infoVoting['votingData']['winnerProposal'] = auth.contractStatusData.votingmachine.getVotingData['winnerProposal']
        infoVoting['votingData']['inFavorVotes'] = new BigNumber(
            Web3.utils.fromWei(
                auth.contractStatusData.votingmachine.getVotingData['inFavorVotes'],
                'ether'
            )
        );
        infoVoting['votingData']['againstVotes'] = new BigNumber(
            Web3.utils.fromWei(
                auth.contractStatusData.votingmachine.getVotingData['againstVotes'],
                'ether'
            )
        );
        infoVoting['votingData']['votingExpirationTime'] = new BigNumber(
            auth.contractStatusData.votingmachine.getVotingData['votingExpirationTime']
        ).times(1000)
        infoVoting['votingData']['votingExpirationTimeFormat'] = formatTimestamp(
            infoVoting['votingData']['votingExpirationTime'].toNumber())

        let expired = true
        if (infoVoting['votingData']['votingExpirationTime'].gt(nowTimestamp)) expired = false
        infoVoting['votingData']['expired'] = expired

        infoVoting['votingData']['totalVoted'] = infoVoting['votingData']['inFavorVotes']
            .plus(infoVoting['votingData']['againstVotes'])
        infoVoting['votingData']['totalVotedPCT'] = infoVoting['votingData']['totalVoted']
            .times(100)
            .div(infoVoting['totalSupply'])
        infoVoting['votingData']['inFavorVotesTotalSupplyPCT'] = infoVoting['votingData']['inFavorVotes']
            .times(100)
            .div(infoVoting['totalSupply'])
        infoVoting['votingData']['againstVotesTotalSupplyPCT'] = infoVoting['votingData']['againstVotes']
            .times(100)
            .div(infoVoting['totalSupply'])

        infoVoting['votingData']['inFavorVotesPCT'] = infoVoting['votingData']['inFavorVotes']
            .times(100)
            .div(infoVoting['votingData']['totalVoted'])
        infoVoting['votingData']['againstVotesPCT'] = infoVoting['votingData']['againstVotes']
            .times(100)
            .div(infoVoting['votingData']['totalVoted'])

        // Voting Info
        infoVoting['votingInfo']['winnerProposal'] = auth.contractStatusData.votingmachine.getVoteInfo['winnerProposal']
        infoVoting['votingInfo']['inFavorVotes'] = new BigNumber(
            Web3.utils.fromWei(
                auth.contractStatusData.votingmachine.getVoteInfo['inFavorVotes'],
                'ether'
            )
        );
        infoVoting['votingInfo']['againstVotes'] = new BigNumber(
            Web3.utils.fromWei(
                auth.contractStatusData.votingmachine.getVoteInfo['againstVotes'],
                'ether'
            )
        );

    }

    const infoUser = {
        'Voting_Power': new BigNumber(0),
        'Voting_Power_PCT': new BigNumber(0),
    }

    if (auth.userBalanceData) {
        const userBalance = new BigNumber(
            Web3.utils.fromWei(
                auth.userBalanceData.stakingmachine.getBalance,
                'ether'
            )
        );

        const lockedAmount = new BigNumber(
            Web3.utils.fromWei(
                auth.userBalanceData.stakingmachine.getLockingInfo.amount,
                'ether'
            )
        );

        const untilTimestamp = new BigNumber(
            auth.userBalanceData.stakingmachine.getLockingInfo.untilTimestamp
        ).times(1000)

        if (untilTimestamp.gt(nowTimestamp)) {
            infoUser['Voting_Power'] = userBalance.minus(lockedAmount)
        } else {
            infoUser['Voting_Power'] = userBalance
        }

        infoUser['Voting_Power_PCT'] = infoUser['Voting_Power'].times(100).div(infoVoting['totalSupply'])
    }

    return (
        <div className={'layout-card'}>

            {/* PROPOSAL STAGE */}
            {infoVoting['state'] === 0 && (
                <div>
                    <div className={'layout-card-title'}>
                        <h1>Proposals</h1>
                    </div>

                    <div className="section voting__proposals">
                        <Proposals infoVoting={infoVoting} infoUser={infoUser}/>
                    </div>
                </div>
            )}

            {/* VOTING STAGE */}
            {infoVoting['state'] === 1 && (
                <div className="section voting">
                    <Vote infoVoting={infoVoting} infoUser={infoUser} />
                </div>
            )}
        </div>
    )
}