import React from 'react';

import { useProjectTranslation } from '../../helpers/translations';
import CompletedBar from './CompletedBar';
import BigNumber from 'bignumber.js';
import ProposalStats from './ProposalStats';


function CreateBarGraph(props) {
    return (
        <CompletedBar
            key={props.id}
            description={props.description}
            percentage={props.percentage}
            needed={props.needed}
            type={props.type}
            // labelCurrent={props.labelCurrent}
            // labelNeedIt={props.labelNeedIt}
            // labelTotal={props.labelTotal}
            // valueCurrent={props.valueCurrent}
            // valueNeedIt={props.valueNeedIt}
            // valueTotal={props.valueTotal}
            // pctCurrent={props.pctCurrent}
            // pctNeedIt={props.pctNeedIt}
            label1={props.label1}
            amount1={props.amount1}
            percentage1={props.percentage1}
            label2={props.label2}
            amount2={props.amount2}
            percentage2={props.percentage2}
            label3={props.label3}
            amount3={props.amount3}
            percentage3={props.percentage3}
        />
    );
}

function CreateStats(props) {
    return (
        <ProposalStats
            key={props.id}
            label={props.label}
            amount={props.amount}
            percentage={props.percentage}
        />
    );
}

function Proposal(props) {
    const { proposal, onViewProposal, infoVoting, onRunPreVoteStep } = props;
    const {t} = useProjectTranslation();
    //const space = '\u00A0';

    const preVotingGraphs = [
        {
            id: 0,
            description: 'Votes required to move to the next stage',
            percentage: `${proposal.votesPositivePCT}%`,
            needed: `${infoVoting.PRE_VOTE_MIN_PCT_TO_WIN}%`,
            type: 'brand',
            // labelCurrent: 'Votes',
            // labelNeedIt: 'Quorum',
            // labelTotal: 'Total circulating tokens',
            // valueCurrent: proposal.votesPositive,
            // valueNeedIt: infoVoting['PRE_VOTE_MIN_TO_WIN'],
            // valueTotal: infoVoting['totalSupply'],
            // pctCurrent: proposal.votesPositivePCT,
            // pctNeedIt: new BigNumber(infoVoting['PRE_VOTE_MIN_PCT_TO_WIN']),

            label1: 'Votes received',
            amount1: proposal.votesPositive,
            percentage1: proposal.votesPositivePCT,
            label2: 'Votes needed for Quroum',
            amount2: infoVoting['PRE_VOTE_MIN_TO_WIN'],
            percentage2: new BigNumber(infoVoting['PRE_VOTE_MIN_PCT_TO_WIN']),
            label3: 'Total circulating tokens',
            amount3: infoVoting['totalSupply'],
            percentage3: new BigNumber(100)
        }
    ];

    const preVotingStats = [
        {
            id: 0,
            label: 'Votes received',
            amount: proposal.votesPositive,
            percentage: proposal.votesPositivePCT
        },
        {
            id: 1,
            label: 'Requiered Quorum',
            amount: infoVoting['PRE_VOTE_MIN_TO_WIN'],
            percentage: new BigNumber(infoVoting['PRE_VOTE_MIN_PCT_TO_WIN'])
        },
        {
            id: 2,
            label: 'Total circulating Tokens',
            amount: infoVoting['totalSupply'],
            percentage: 100
        }
    ];

    return (
        <div className="proposal__wrapper">
            <div className="title">{proposal.changeContract}</div>
            <div className="proposal__content">
                <div className="details">
                    {/*{proposal.canRunStep && (*/}
                    {/*    <div className='proposal-period'>The first stage voting period is over!</div>*/}
                    {/*)}*/}

                    {/*{!proposal.canRunStep && (*/}
                    {/*    <div className='proposal-period'>The first stage voting is in progress!</div>*/}
                    {/*)}*/}

                    <div className="externalLink">
                        <a
                            className="forumLink"
                            href={`https://forum.moneyonchain.com/search?q=${proposal.changeContract}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {t('voting.info.searchForum')}
                            <div className="icon-external-link"></div>
                        </a>
                    </div>

                    <div className="externalLink">
                        <a
                            className="forumLink"
                            href={`https://rootstock.blockscout.com/address/${proposal.changeContract}?tab=contract`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {t('voting.info.changeContract')}{' '}
                            {proposal.changeContract}
                            <span className="icon-external-link"></span>
                        </a>
                    </div>
                    <p>
                        {t('voting.info.stateAs')}
                        <span>{proposal.expirationTimeStampFormat} </span>
                    </p>

                    <div className="votingStatus__graphs">
                        {preVotingGraphs.map(CreateBarGraph)}
                    </div>
                </div>
                <div className="cta">
                    <div className="cta-container">
                        <div className="cta-info-group center">
                            <div className="cta-info-detail">
                                <div className="votingPowerContainer">
                                    <div className="votingPowerLabel">
                                        Your voting power stats:
                                    </div>
                                    <div className="votingPowerData">
                                        {preVotingStats.map(CreateStats)}
                                    </div>
                                </div>
                            </div>
                            <div className="cta-info-summary "></div>
                        </div>
                        <div className="cta-options-group">
                            {proposal.canRunStep && (
                                <button
                                    className="button secondary"
                                    onClick={() => onRunPreVoteStep()}
                                >
                                    Push to Next Step
                                </button>
                            )}
                            <button
                                className="button"
                                onClick={() =>
                                    onViewProposal(proposal.changeContract)
                                }
                            >
                                {t('View Proposal')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Proposal;
