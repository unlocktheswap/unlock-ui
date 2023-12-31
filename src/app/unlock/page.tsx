'use client';

import { Web3Provider } from '@ethersproject/providers';
import { Contract } from 'ethers';
import { useEffect } from 'react';

const wagmigotchiABI = {
  contractName: 'PublicLock',
  abi: [
    'error CANNOT_APPROVE_SELF()',
    'error CANT_BE_SMALLER_THAN_SUPPLY()',
    'error CANT_EXTEND_NON_EXPIRING_KEY()',
    'error GAS_REFUND_FAILED()',
    'error INSUFFICIENT_ERC20_VALUE()',
    'error INSUFFICIENT_VALUE()',
    'error INVALID_ADDRESS()',
    'error INVALID_HOOK(uint8 hookIndex)',
    'error INVALID_LENGTH()',
    'error INVALID_TOKEN()',
    'error KEY_NOT_VALID()',
    'error KEY_TRANSFERS_DISABLED()',
    'error LOCK_HAS_CHANGED()',
    'error LOCK_SOLD_OUT()',
    'error MAX_KEYS_REACHED()',
    'error MIGRATION_REQUIRED()',
    'error NON_COMPLIANT_ERC721_RECEIVER()',
    'error NON_RENEWABLE_LOCK()',
    'error NOT_ENOUGH_FUNDS()',
    'error NOT_ENOUGH_TIME()',
    'error NOT_READY_FOR_RENEWAL()',
    'error NO_SUCH_KEY()',
    'error NULL_VALUE()',
    'error ONLY_KEY_MANAGER_OR_APPROVED()',
    'error ONLY_LOCK_MANAGER()',
    'error ONLY_LOCK_MANAGER_OR_KEY_GRANTER()',
    'error OUT_OF_RANGE()',
    'error OWNER_CANT_BE_ADDRESS_ZERO()',
    'error SCHEMA_VERSION_NOT_CORRECT()',
    'error TRANSFER_TO_SELF()',
    'error TransferFailed()',
    'error UNAUTHORIZED()',
    'error UNAUTHORIZED_KEY_MANAGER_UPDATE()',
    'event Approval (address indexed owner,address indexed approved,uint256 indexed tokenId)',
    'event ApprovalForAll (address indexed owner,address indexed operator,bool approved)',
    'event CancelKey (uint256 indexed tokenId,address indexed owner,address indexed sendTo,uint256 refund)',
    'event EventHooksUpdated (address onKeyPurchaseHook,address onKeyCancelHook,address onValidKeyHook,address onTokenURIHook,address onKeyTransferHook,address onKeyExtendHook,address onKeyGrantHook)',
    'event ExpirationChanged (uint256 indexed tokenId,uint256 newExpiration,uint256 amount,bool timeAdded)',
    'event ExpireKey (uint256 indexed tokenId)',
    'event GasRefundValueChanged (uint256 refundValue)',
    'event GasRefunded (address indexed receiver,uint256 refundedAmount,address tokenAddress)',
    'event Initialized (uint8 version)',
    'event KeyExtended (uint256 indexed tokenId,uint256 newTimestamp)',
    'event KeyGranterAdded (address indexed account)',
    'event KeyGranterRemoved (address indexed account)',
    'event KeyManagerChanged (uint256 indexed _tokenId,address indexed _newManager)',
    'event KeysMigrated (uint256 updatedRecordsCount)',
    'event LockConfig (uint256 expirationDuration,uint256 maxNumberOfKeys,uint256 maxKeysPerAcccount)',
    'event LockManagerAdded (address indexed account)',
    'event LockManagerRemoved (address indexed account)',
    'event LockMetadata (string name,string symbol,string baseTokenURI)',
    'event OwnershipTransferred (address previousOwner,address newOwner)',
    'event PricingChanged (uint256 oldKeyPrice,uint256 keyPrice,address oldTokenAddress,address tokenAddress)',
    'event ReferrerFee (address indexed referrer,uint256 fee)',
    'event RefundPenaltyChanged (uint256 freeTrialLength,uint256 refundPenaltyBasisPoints)',
    'event RoleAdminChanged (bytes32 indexed role,bytes32 indexed previousAdminRole,bytes32 indexed newAdminRole)',
    'event RoleGranted (bytes32 indexed role,address indexed account,address indexed sender)',
    'event RoleRevoked (bytes32 indexed role,address indexed account,address indexed sender)',
    'event Transfer (address indexed from,address indexed to,uint256 indexed tokenId)',
    'event TransferFeeChanged (uint256 transferFeeBasisPoints)',
    'event UnlockCallFailed (address indexed lockAddress,address unlockAddress)',
    'event Withdrawal (address indexed sender,address indexed tokenAddress,address indexed recipient,uint256 amount)',
    'function DEFAULT_ADMIN_ROLE() view returns (bytes32)',
    'function addLockManager(address account)',
    'function approve(address _approved,uint256 _tokenId)',
    'function balanceOf(address _keyOwner) view returns (uint256 balance)',
    'function burn(uint256 _tokenId)',
    'function cancelAndRefund(uint256 _tokenId)',
    'function expirationDuration() view returns (uint256)',
    'function expireAndRefundFor(uint256 _tokenId,uint256 _amount)',
    'function extend(uint256 _value,uint256 _tokenId,address _referrer,bytes _data) payable',
    'function freeTrialLength() view returns (uint256)',
    'function gasRefundValue() view returns (uint256 _refundValue)',
    'function getApproved(uint256 _tokenId) view returns (address)',
    'function getCancelAndRefundValue(uint256 _tokenId) view returns (uint256 refund)',
    'function getHasValidKey(address _keyOwner) view returns (bool isValid)',
    'function getRoleAdmin(bytes32 role) view returns (bytes32)',
    'function getTransferFee(uint256 _tokenId,uint256 _time) view returns (uint256)',
    'function grantKeyExtension(uint256 _tokenId,uint256 _duration)',
    'function grantKeys(address[] _recipients,uint256[] _expirationTimestamps,address[] _keyManagers) returns (uint256[])',
    'function grantRole(bytes32 role,address account)',
    'function hasRole(bytes32 role,address account) view returns (bool)',
    'function initialize(address _lockCreator,uint256 _expirationDuration,address _tokenAddress,uint256 _keyPrice,uint256 _maxNumberOfKeys,string _lockName)',
    'function isApprovedForAll(address _owner,address _operator) view returns (bool)',
    'function isLockManager(address account) view returns (bool)',
    'function isOwner(address account) view returns (bool)',
    'function isRenewable(uint256 _tokenId,address _referrer) view returns (bool)',
    'function isValidKey(uint256 _tokenId) view returns (bool)',
    'function keyExpirationTimestampFor(uint256 _tokenId) view returns (uint256)',
    'function keyManagerOf(uint256) view returns (address)',
    'function keyPrice() view returns (uint256)',
    'function lendKey(address _from,address _recipient,uint256 _tokenId)',
    'function maxKeysPerAddress() view returns (uint256)',
    'function maxNumberOfKeys() view returns (uint256)',
    'function mergeKeys(uint256 _tokenIdFrom,uint256 _tokenIdTo,uint256 _amount)',
    'function migrate(bytes)',
    'function name() view returns (string)',
    'function numberOfOwners() view returns (uint256)',
    'function onKeyCancelHook() view returns (address)',
    'function onKeyExtendHook() view returns (address)',
    'function onKeyGrantHook() view returns (address)',
    'function onKeyPurchaseHook() view returns (address)',
    'function onKeyTransferHook() view returns (address)',
    'function onTokenURIHook() view returns (address)',
    'function onValidKeyHook() view returns (address)',
    'function owner() view returns (address)',
    'function ownerOf(uint256 _tokenId) view returns (address)',
    'function publicLockVersion() pure returns (uint16)',
    'function purchase(uint256[] _values,address[] _recipients,address[] _referrers,address[] _keyManagers,bytes[] _data) payable returns (uint256[])',
    'function purchasePriceFor(address _recipient,address _referrer,bytes _data) view returns (uint256 minKeyPrice)',
    'function referrerFees(address) view returns (uint256)',
    'function refundPenaltyBasisPoints() view returns (uint256)',
    'function renewMembershipFor(uint256 _tokenId,address _referrer)',
    'function renounceLockManager()',
    'function renounceRole(bytes32 role,address account)',
    'function revokeRole(bytes32 role,address account)',
    'function safeTransferFrom(address _from,address _to,uint256 _tokenId)',
    'function safeTransferFrom(address _from,address _to,uint256 _tokenId,bytes _data)',
    'function schemaVersion() view returns (uint256)',
    'function setApprovalForAll(address _to,bool _approved)',
    'function setEventHooks(address _onKeyPurchaseHook,address _onKeyCancelHook,address _onValidKeyHook,address _onTokenURIHook,address _onKeyTransferHook,address _onKeyExtendHook,address _onKeyGrantHook)',
    'function setGasRefundValue(uint256 _refundValue)',
    'function setKeyManagerOf(uint256 _tokenId,address _keyManager)',
    'function setLockMetadata(string _lockName,string _lockSymbol,string _baseTokenURI)',
    'function setOwner(address account)',
    'function setReferrerFee(address _referrer,uint256 _feeBasisPoint)',
    'function shareKey(address _to,uint256 _tokenIdFrom,uint256 _timeShared)',
    'function supportsInterface(bytes4 interfaceId) view returns (bool)',
    'function symbol() view returns (string)',
    'function tokenAddress() view returns (address)',
    'function tokenByIndex(uint256 _index) view returns (uint256)',
    'function tokenOfOwnerByIndex(address _keyOwner,uint256 _index) view returns (uint256)',
    'function tokenURI(uint256 _tokenId) view returns (string)',
    'function totalKeys(address _keyOwner) view returns (uint256)',
    'function totalSupply() view returns (uint256 _totalKeysCreated)',
    'function transferFeeBasisPoints() view returns (uint256)',
    'function transferFrom(address _from,address _recipient,uint256 _tokenId)',
    'function unlendKey(address _recipient,uint256 _tokenId)',
    'function unlockProtocol() view returns (address)',
    'function updateKeyPricing(uint256 _keyPrice,address _tokenAddress)',
    'function updateLockConfig(uint256 _newExpirationDuration,uint256 _maxNumberOfKeys,uint256 _maxKeysPerAcccount)',
    'function updateRefundPenalty(uint256 _freeTrialLength,uint256 _refundPenaltyBasisPoints)',
    'function updateSchemaVersion()',
    'function updateTransferFee(uint256 _transferFeeBasisPoints)',
    'function withdraw(address _tokenAddress,address _recipient,uint256 _amount)',
  ],
  bytecodeHash: '0x80041134ce431f1adb2b2dfe00df82753d269761cbf9bac1232e0523fa787ed2',
};
export default function Unlock() {
  const loadContract = async () => {
    const provider = await new Web3Provider(window.ethereum);
    const contract = new Contract('0xF4c112d5434D3BCEB266F46451BaDd7EdB111d9E', wagmigotchiABI.abi, provider);

    const balancer = await contract.balanceOf('0x3F41520c4A7C578644d5E5256c1E040e863bD662');
    console.log('balancer', balancer);
  };
  useEffect(() => {
    loadContract();
  }, []);

  return <div> Something</div>;
}
