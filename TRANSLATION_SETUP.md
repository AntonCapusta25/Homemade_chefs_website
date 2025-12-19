# Blog Translation Setup

## Get Your Gemini API Key

1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key

## Add to .env.local

Add this line to your `.env.local` file:

```bash
GEMINI_API_KEY=your_api_key_here
```

## Usage

### Test with 3 posts (dry run - no database changes):
```bash
npm run translate-blogs -- --dry-run --limit=3
```

### Translate 10 posts to Dutch only:
```bash
npm run translate-blogs -- --limit=10 --lang=nl
```

### Translate all posts to both languages:
```bash
npm run translate-blogs
```

### Options:
- `--dry-run` - Test without saving to database
- `--limit=N` - Only translate N posts
- `--lang=nl` or `--lang=fr` - Translate to specific language only

## Expected Time
- 3 posts (dry run): ~30 seconds
- 53 posts × 2 languages: ~15-20 minutes

## Cost
- Gemini 1.5 Flash is FREE up to 15 requests/minute
- We're well within the free tier
