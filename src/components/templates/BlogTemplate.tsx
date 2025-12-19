
import BlogHero from '@/components/blog/BlogHero';
import BlogList from '@/components/blog/BlogList';
import FAQCreative from '@/components/FAQCreative';
import CallToAction from '@/components/CallToAction';
import LiveSupport from '@/components/LiveSupport';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function BlogTemplate({ data, isEditor = false, onUpdate }: { data: any, isEditor?: boolean, onUpdate?: (field: string, value: any) => void }) {
    // BlogHero might need modifications to accept title params in future, keeping it simple for now
    // as BlogHero structure was rigid in user request.
    const posts = data?.posts || [];
    const hero = data?.hero || {};

    return (
        <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
            <BlogHero title={hero.title} subtitle={hero.subtitle} videoUrl={hero.videoUrl} onUpdate={onUpdate} />
            <BlogList posts={posts} isEditor={isEditor} />
            <FAQCreative />
            <CallToAction />
            <LiveSupport />
        </div>
    );
}
