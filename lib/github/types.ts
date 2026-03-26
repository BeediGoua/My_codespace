export type GitHubUser = {
    login: string;
    name: string | null;
    html_url: string;
};

export type GitHubRepo = {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
    private: boolean;
    fork: boolean;
    description: string | null;
    updated_at: string;
};