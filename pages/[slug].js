import { MDXRemote } from 'next-mdx-remote';
import getPost from '../helpers/getPost';
import getPosts from '../helpers/getPosts';
import { serialize } from 'next-mdx-remote/serialize';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';

const options = {
  mdxOptions: {
    remarkPlugins: [],
    rehypePlugins: [rehypeHighlight],
  },
};

function Post({ data, content }) {
  return (
    <div>
      <h1 className="font-bold text-7xl mt-24 mb-12">{data.title}</h1>
      <time className="text-gray-500 italic">{data.date}</time>
      <p className="prose mt-12">
        <MDXRemote {...content} options={options} />
      </p>
    </div>
  );
}

export default Post;

export const getStaticPaths = async () => {
  const posts = await getPosts();
  const paths = posts.map((post) => ({ params: { slug: post.slug } }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const post = await getPost(params.slug);
  const mdxSource = await serialize(post.content, {
    mdxOptions: { rehypePlugins: [rehypeHighlight] },
  });
  return {
    props: {
      data: post.data,
      content: mdxSource,
    },
  };
};
