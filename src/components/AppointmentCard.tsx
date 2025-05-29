import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { AppointmentType } from '@/models/AppointmentModel';

type Props = {
  appointment: AppointmentType;
  onEdit: () => void;
  onDelete: () => void;
};

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
    <div className="flex items-center justify-between p-3 border rounded-md shadow-sm">
      <div>
        <div className="font-medium">{appointment.name}</div>
        <div className="text-sm">{appointment.mobile}</div>
        <div className="text-sm text-gray-600">{appointment.time}</div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical className="h-5 w-5 cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};