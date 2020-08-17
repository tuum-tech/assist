export class DocumentSearchDTO{
    public id: string;
    public did: string;
    public documents: DocumentMap;
    public num_searches: number;
    public created: string;
    public modified: string;
}

export interface DocumentMap{
    [did: string] : DocumentDTO
}

export interface SubjectMap{
    [id: string] : any
}

export class DocumentDTO{
    published: string;
    verifiable_creds: VerifiableCredentialDTO[];
}

export class VerifiableCredentialDTO{
    id: string;
    issuance_date: string;
    subject: SubjectMap;
    expiration_date: string;
    type: string[];
    issuer: string;
}