export class ResponsePostDto {
    id: number;
    title: string;
    content?: string | null;
    isPinned: boolean;
}