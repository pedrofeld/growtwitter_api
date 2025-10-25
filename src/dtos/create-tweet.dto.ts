export interface CreateTweetDto {
    content: string;
    userId: string;
    parentId?: string | null;
}