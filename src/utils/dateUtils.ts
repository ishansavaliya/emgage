import { format, parseISO } from 'date-fns';

export const formatDate = (dateString: string): string => {
    const date = parseISO(dateString);
    return format(date, 'MMMM dd, yyyy HH:mm:ss');
};

export const calculateDuration = (startDate: string, endDate: string): string => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = end.getTime() - start.getTime();
    
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((duration % (1000 * 60)) / 1000);
    
    return `${hours}h ${minutes}m ${seconds}s`;
};