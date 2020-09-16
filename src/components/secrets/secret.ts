export interface Secret {
  _id: string;
  name: string;
  value: string;
  repoId: string;
  protectedBranchesOnly?: boolean;
  branches?: string[];
}

export interface GlobalSecret {
  name: string;
  value: string;
  protectedBranchesOnly?: boolean;
  branches?: string[];
}
