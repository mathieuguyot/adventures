import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

type MarkdownEditorProps = {
    markdown: string;
};

export default function MarkdownEditor({ markdown }: MarkdownEditorProps) {
    return (
        <div style={{ overflowWrap: "break-word", textJustify: "auto" }}>
            <ReactMarkdown className="markdown" rehypePlugins={[rehypeRaw]}>
                {markdown}
            </ReactMarkdown>
        </div>
    );
}
