import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, User } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { getPost, type PostRecord } from '../api/adminApi';

export default function NewsDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [article, setArticle] = useState<PostRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const post = await getPost(id);
        if (!cancelled) {
          setArticle(post);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || 'Failed to load article');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading && !article && !error) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
          <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8 py-10">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <div className="text-2xl font-extrabold text-slate-900">Loading article…</div>
              <div className="mt-2 text-slate-600">Please wait while we fetch the latest story.</div>
              <div className="mt-6 flex gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-bold text-slate-900 hover:bg-slate-50"
                >
                  <ArrowLeft size={18} />
                  Back
                </button>
                <Link
                  to="/news"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700"
                >
                  View all news
                </Link>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!article || error) {
    const message = error || 'The news article you’re looking for doesn’t exist.';

    return (
      <PageLayout>
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
          <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8 py-10">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <div className="text-2xl font-extrabold text-slate-900">Article not found</div>
              <div className="mt-2 text-slate-600">{message}</div>
              <div className="mt-6 flex gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-bold text-slate-900 hover:bg-slate-50"
                >
                  <ArrowLeft size={18} />
                  Back
                </button>
                <Link
                  to="/news"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700"
                >
                  View all news
                </Link>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8 py-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="relative h-[260px] sm:h-[340px] bg-slate-200">
              <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute left-5 bottom-5">
                <div className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold text-red-600">
                  {article.category}
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900">{article.title}</h1>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-600">
                  <span className="inline-flex items-center gap-2">
                    <Calendar size={16} />
                    {article.date}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <User size={16} />
                    {article.author}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {article.tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700"
                    >
                      <Tag size={14} className="text-slate-500" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-4 text-slate-700 leading-7">
                {article.content.map((p, idx) => (
                  <p key={idx} className="text-base">
                    {p}
                  </p>
                ))}
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/global-market"
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700"
                >
                  Browse Marketplace
                </Link>
                <Link
                  to="/news"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 font-bold text-slate-900 hover:bg-slate-50"
                >
                  Back to News
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
