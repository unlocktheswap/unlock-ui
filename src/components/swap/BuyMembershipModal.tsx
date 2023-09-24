import Button from '@/components/core/buttons/Button';
import SingleSectionModal from '@/components/core/modals/SingleSectionModal';

export interface MembershipModal {
  open: boolean;
  onClose: () => void;
}
export default function BuyMembershipModal({ open, onClose }: MembershipModal) {
  return (
    <SingleSectionModal open={open} title="Buy Membership" onClose={onClose} showCloseButton={true}>
      <div className="h-full flex flex-col justify-between">
        <div className="h-48">Fixed protocol subscription allows you to swap in this pool without trading and gas fees</div>
        <div>
          <Button primary variant={'contained'} onClick={() => onClose()}>
            Buy Membership
          </Button>
        </div>
      </div>
    </SingleSectionModal>
  );
}
