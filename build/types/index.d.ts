export interface ParsedDirectives {
    exclude?: boolean;
    secure?: {
        hash: string;
    };
    transform?: {
        type: string;
        name: string;
        custom_type?: string;
        repeated?: boolean;
        oneof?: string;
        map_key?: string;
        map_value?: string;
    };
    [key: string]: any;
}
