import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
// import { AppointmentType } from '@/models/AppointmentModel';

// type Props = {
//   appointment: AppointmentType;
//   onEdit: () => void;
//   onDelete: () => void;
// };

export const AppointmentCard = ({
  appointment,
  onEdit,
  onDelete,
}: {
  appointment: { _id: string; name: string; mobile: string; time: string };
  onEdit: () => void;
  onDelete: () => void;
}) => {
  return (
    <div
      className="flex items-center justify-between p-4 bg-white border border-[#E0EAF4] 
                 rounded-2xl shadow-md hover:ring-2 hover:ring-[#76C7C0] transition-all"
    >
      <div>
        <div className="text-base font-medium text-[#1C1F26]">
          {appointment.name}
        </div>
        <div className="text-sm text-muted-foreground">
          {appointment.mobile}
        </div>
        <div className="text-sm text-[#2E86AB] font-semibold">
          {appointment.time}
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="p-2 rounded-md hover:bg-[#F5F9FF] transition-colors"
            aria-label="More options"
          >
            <MoreVertical className="h-5 w-5 text-[#1C1F26]" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="rounded-xl border border-[#DDE6F1] shadow-lg">
          <DropdownMenuItem
            onClick={onEdit}
            className="text-sm hover:bg-[#F4F8FF] cursor-pointer"
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDelete}
            className="text-sm text-red-600 hover:bg-red-50 cursor-pointer"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};