declare module 'next-pdf' {
    export const PDFRenderer: {
        renderToStream: (component: React.ReactNode) => Promise<ReadableStream<Uint8Array>>;
    };
}