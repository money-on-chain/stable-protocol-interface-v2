import React, { useContext, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import { AuthenticateContext } from '../../context/Auth';
import Proposals from './Proposals';
import Vote from './Vote';
import { formatTimestamp } from '../../helpers/staking';
import { useProjectTranslation } from '../../helpers/translations';

import './Styles.scss';

export default function Voting(props) {
    const [t, i18n, ns] = useProjectTranslation();

    const auth = useContext(AuthenticateContext);

    const nowTimestamp = new BigNumber(Date.now());
    const defaultInfoVoting = {
        globalVotingRound: new BigNumber(0),
        totalSupply: new BigNumber(0),
        PRE_VOTE_MIN_TO_WIN: new BigNumber(0),
        PRE_VOTE_MIN_PCT_TO_WIN: new BigNumber(0),
        MIN_PCT_FOR_QUORUM: new BigNumber(0),
        MIN_FOR_QUORUM: new BigNumber(0),
        MIN_STAKE: new BigNumber(0),
        VOTING_POWER: new BigNumber(0),
        VOTE_MIN_PCT_TO_VETO: new BigNumber(0),
        VOTE_MIN_TO_VETO: new BigNumber(0),
        proposals: [],
        state: 0,
        readyToPreVoteStep: 0,
        readyToVoteStep: 0,
        votingData: {
            winnerProposal: '',
            inFavorVotes: new BigNumber(0),
            againstVotes: new BigNumber(0),
            votingExpirationTime: new BigNumber(0),
            expired: true,
            totalVotedPCT: new BigNumber(0),
            totalVoted: new BigNumber(0)
        },
        votingInfo: {
            winnerProposal: '',
            inFavorVotes: new BigNumber(0),
            againstVotes: new BigNumber(0)
        }
    };
    const [infoVoting, setInfoVoting] = useState(defaultInfoVoting);

    const defaultInfoUser = {
        Voting_Power: new BigNumber(0),
        Voting_Power_PCT: new BigNumber(0)
    };
    const [infoUser, setInfoUser] = useState(defaultInfoUser);

    useEffect(() => {
        if (auth.contractStatusData && auth.userBalanceData) {
            refreshData();
        }
    }, [auth]);

    const refreshData = () => {
        const cData = { ...infoVoting };
        cData['proposals'] =
            auth.contractStatusData.votingmachine.getProposalByIndex;
        cData['state'] = new BigNumber(
            auth.contractStatusData.votingmachine.getState
        ).toNumber();
        cData['readyToPreVoteStep'] = new BigNumber(
            auth.contractStatusData.votingmachine.readyToPreVoteStep
        ).toNumber();
        cData['readyToVoteStep'] = new BigNumber(
            auth.contractStatusData.votingmachine.readyToVoteStep
        ).toNumber();
        cData['globalVotingRound'] = new BigNumber(
            auth.contractStatusData.votingmachine.getVotingRound
        );
        cData['totalSupply'] = new BigNumber(
            Web3.utils.fromWei(
                auth.contractStatusData.votingmachine.totalSupply,
                'ether'
            )
        );
        cData['PRE_VOTE_MIN_PCT_TO_WIN'] =
            auth.contractStatusData.votingmachine.PRE_VOTE_MIN_PCT_TO_WIN;
        cData['PRE_VOTE_MIN_TO_WIN'] = new BigNumber(cData['totalSupply'])
            .times(new BigNumber(cData['PRE_VOTE_MIN_PCT_TO_WIN']))
            .div(100);
        cData['MIN_STAKE'] = new BigNumber(
            Web3.utils.fromWei(
                auth.contractStatusData.votingmachine.MIN_STAKE,
                'ether'
            )
        );
        cData['MIN_PCT_FOR_QUORUM'] =
            auth.contractStatusData.votingmachine.MIN_PCT_FOR_QUORUM;
        cData['MIN_FOR_QUORUM'] = new BigNumber(cData['totalSupply'])
            .times(new BigNumber(cData['MIN_PCT_FOR_QUORUM']))
            .div(100);
        cData['VOTE_MIN_PCT_TO_VETO'] =
            auth.contractStatusData.votingmachine.VOTE_MIN_PCT_TO_VETO;
        cData['VOTE_MIN_TO_VETO'] = new BigNumber(cData['totalSupply'])
            .times(new BigNumber(cData['VOTE_MIN_PCT_TO_VETO']))
            .div(100);

        // Voting Data
        cData['votingData']['winnerProposal'] =
            auth.contractStatusData.votingmachine.getVotingData[
                'winnerProposal'
            ];
        cData['votingData']['inFavorVotes'] = new BigNumber(
            Web3.utils.fromWei(
                auth.contractStatusData.votingmachine.getVotingData[
                    'inFavorVotes'
                ],
                'ether'
            )
        );
        cData['votingData']['againstVotes'] = new BigNumber(
            Web3.utils.fromWei(
                auth.contractStatusData.votingmachine.getVotingData[
                    'againstVotes'
                ],
                'ether'
            )
        );
        cData['votingData']['votingExpirationTime'] = new BigNumber(
            auth.contractStatusData.votingmachine.getVotingData[
                'votingExpirationTime'
            ]
        ).times(1000);
        cData['votingData']['votingExpirationTimeFormat'] = formatTimestamp(
            cData['votingData']['votingExpirationTime'].toNumber()
        );

        let expired = true;
        if (cData['votingData']['votingExpirationTime'].gt(nowTimestamp))
            expired = false;
        cData['votingData']['expired'] = expired;

        cData['votingData']['totalVoted'] = cData['votingData'][
            'inFavorVotes'
        ].plus(cData['votingData']['againstVotes']);
        cData['votingData']['totalVotedPCT'] = cData['votingData']['totalVoted']
            .times(100)
            .div(cData['totalSupply']);
        cData['votingData']['inFavorVotesTotalSupplyPCT'] = cData['votingData'][
            'inFavorVotes'
        ]
            .times(100)
            .div(cData['totalSupply']);
        cData['votingData']['againstVotesTotalSupplyPCT'] = cData['votingData'][
            'againstVotes'
        ]
            .times(100)
            .div(cData['totalSupply']);

        cData['votingData']['inFavorVotesPCT'] = cData['votingData'][
            'inFavorVotes'
        ]
            .times(100)
            .div(cData['votingData']['totalVoted']);
        cData['votingData']['againstVotesPCT'] = cData['votingData'][
            'againstVotes'
        ]
            .times(100)
            .div(cData['votingData']['totalVoted']);

        // Voting Info
        cData['votingInfo']['winnerProposal'] =
            auth.contractStatusData.votingmachine.getVoteInfo['winnerProposal'];
        cData['votingInfo']['inFavorVotes'] = new BigNumber(
            Web3.utils.fromWei(
                auth.contractStatusData.votingmachine.getVoteInfo[
                    'inFavorVotes'
                ],
                'ether'
            )
        );
        cData['votingInfo']['againstVotes'] = new BigNumber(
            Web3.utils.fromWei(
                auth.contractStatusData.votingmachine.getVoteInfo[
                    'againstVotes'
                ],
                'ether'
            )
        );
        setInfoVoting(cData);

        const cDataUser = { ...infoUser };
        let vUsing;
        if (auth.isVestingLoaded()) {
            vUsing = auth.userBalanceData.vestingmachine.staking;
        } else {
            vUsing = auth.userBalanceData.stakingmachine;
        }

        const userBalance = new BigNumber(
            Web3.utils.fromWei(vUsing.getBalance, 'ether')
        );

        const lockedAmount = new BigNumber(
            Web3.utils.fromWei(vUsing.getLockingInfo.amount, 'ether')
        );

        const untilTimestamp = new BigNumber(
            vUsing.getLockingInfo.untilTimestamp
        ).times(1000);

        if (untilTimestamp.gt(nowTimestamp)) {
            cDataUser['Voting_Power'] = userBalance.minus(lockedAmount);
        } else {
            cDataUser['Voting_Power'] = userBalance;
        }

        cDataUser['Voting_Power_PCT'] = cDataUser['Voting_Power']
            .times(100)
            .div(cData['totalSupply']);

        setInfoUser(cDataUser);
    };

    return (
        <div className="section-container">
            {/* <div className="content-page"> */}
            <div className={'layout-card'}>
                <div className={'layout-card-title'}>
                    <h1>{t('voting.cardTitle.section')}</h1>
                </div>
                {/* PROPOSAL STAGE */}
                {infoVoting['state'] === 0 && (
                    <div>
                        {/* <div className={'layout-card-title'}>
                        <h1>Proposals</h1>
                    </div> */}

                        <div className="section voting__proposals">
                            <Proposals
                                infoVoting={infoVoting}
                                infoUser={infoUser}
                            />
                        </div>
                    </div>
                )}
                {/* VOTING STAGE */}
                {(infoVoting['state'] === 1 || infoVoting['state'] === 2) && (
                    <div>
                        {/* <div className={'layout-card-title'}>
                        <h1>{t('voting.cardTitle.votingStaged')}</h1>
                    </div> */}
                        <div className="section voting">
                            <Vote infoVoting={infoVoting} infoUser={infoUser} />
                        </div>
                    </div>
                )}
            </div>
            {/* </div> */}
        </div>
    );
}
