export class Post {
    postNumber: number;

    name: string = '';
    description: string = '';

    dateCreated: any;

    userId: number;

    constructor(
        postNumber: number,
        name: string,
        description: string,
        dateCreated: Date,
        userId: number
    ) {

    }
}
