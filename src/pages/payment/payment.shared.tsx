import { useState } from 'react';
import { useMatch } from '@tanstack/react-location';
import { useAccount } from 'wagmi';
import Dapp from 'src/dapp';
import store from 'src/store/store';
import { hideSpinner, showSpinner } from 'src/store/reducers/spinner.reducer';
import { endpoint } from 'src/core/endpoints';
import { confirmPayment, getCreditCardInfo } from './payment.service';
import { dialog } from 'src/core/dialog/dialog';
import { getMonthName } from 'src/core/time';
import { Resolver } from './payment.types';
import { CardInfoResp } from 'src/core/types';

export const usePaymentShared = () => {
  const { web3 } = Dapp.useWeb3();
  const { address: account, isConnected } = useAccount();
  const { offer, cardInfo } = useMatch().ownData as Resolver;
  const [process, setProcess] = useState(false);
  const [selectedCard, setSelectedCard] = useState(cardInfo?.items[0]?.id);
  const [cards, setCards] = useState(cardInfo);
  const offerId = offer?.id;
  const { created_at, recipient, assignment_total, project_id, project, payment_mode } = offer || {};
  const { wallet_address: contributor } = recipient?.meta || {};
  const commisionFee = offer.offerer.meta.verified_impact ? 0.02 : 0.03;
  const commision = assignment_total * commisionFee;
  const total_price = commision + assignment_total;
  const start_date = getMonthName(created_at) + ' ' + new Date(created_at).getDate();
  const isPaidCrypto = project?.payment_type === 'PAID' && payment_mode === 'CRYPTO';
  const isDisabledProceedPayment = process || (isPaidCrypto ? !isConnected || !account : !selectedCard);

  function onSelectCard(id: string) {
    setSelectedCard(id);
  }

  function setCardsList(list: CardInfoResp) {
    setCards(list);
  }

  async function onRemoveCard(id: string) {
    setSelectedCard('');
    endpoint.post.payments['{card_id}/remove'](id).then(async () => {
      const result = await getCreditCardInfo();
      setCards(result);
    });
  }

  async function proceedCryptoPayment() {
    // FIXME: please handle this errors in a proper way
    if (!web3) throw new Error('Not allow web3 is not connected');
    if (!contributor) throw new Error('Contributor wallet is not connected');

    setProcess(true);
    store.dispatch(showSpinner());
    const escrowAmount = parseInt(assignment_total.toString());

    try {
      // put escrow on smart contract
      const result = await Dapp.escrow({
        web3,
        escrowAmount,
        contributor,
        projectId: project_id,
      });

      // this is paramater need to sync with backend to make Hire available
      await confirmPayment(offerId, {
        service: 'CRYPTO',
        source: account,
        txHash: result.txHash,
        meta: result,
      });
    } catch (err: any) {
      dialog.alert({
        message: err?.response?.data.error || err?.message,
        title: 'Failed',
      });
    }

    endpoint.post.offers['{offer_id}/hire'](offerId).then(() => history.back());

    setProcess(false);
    store.dispatch(hideSpinner());
  }

  async function proceedFiatPayment() {
    setProcess(true);
    try {
      await confirmPayment(offerId, {
        service: 'STRIPE',
        source: selectedCard,
      });
      endpoint.post.offers['{offer_id}/hire'](offerId).then(() => history.back());
    } catch (err: any) {
      dialog.alert({
        message: err?.response?.data.error || err?.message,
        title: 'Failed',
      });
    }
    setProcess(false);
  }

  return {
    offer,
    commision,
    total_price,
    start_date,
    isPaidCrypto,
    cards,
    setCardsList,
    selectedCard,
    onSelectCard,
    onRemoveCard,
    onClickProceedPayment: isPaidCrypto ? proceedCryptoPayment : proceedFiatPayment,
    isDisabledProceedPayment,
  };
};