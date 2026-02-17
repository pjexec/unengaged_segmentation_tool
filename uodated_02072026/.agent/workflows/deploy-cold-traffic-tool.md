---
description: How to deploy the cold traffic tool to Railway without deploying the main project files
---
# Cold Traffic Tool — Railway Deployment

> ⚠️ **CRITICAL**: The cold traffic tool lives INSIDE a larger repo. You MUST deploy ONLY the `cold-traffic-tool/` subfolder. Do NOT deploy from the parent directory or the main project's files will overwrite the cold traffic tool.

## Correct Deploy Command

```bash
cd /Users/chuckmullaney/Documents/PainlessAI/unengaged_segmentation_tool/uodated_02072026

# The --path-as-root flag is REQUIRED to scope the deploy to ONLY the cold-traffic-tool folder
// turbo
railway up cold-traffic-tool --path-as-root --service cold-traffic-tool
```

## Railway Service Details

- **Project**: cold-traffic-tool
- **Service**: cold-traffic-tool
- **Environment**: production
- **Railway Project ID**: `4f319450-30a3-4276-88ba-5034f89af267`
- **Railway Service ID**: `b82fd15d-0a51-4539-9d8d-d224bc8ae628`
- **Live URL**: https://plannertoolv2.phantomengaged.com/

## Git Workflow

1. Stage only cold-traffic-tool files: `git add cold-traffic-tool/`
2. Commit: `git commit -m "your message"`
3. Push: `git push origin main`
4. Deploy: `railway up cold-traffic-tool --path-as-root --service cold-traffic-tool`

## ❌ DO NOT

- `railway up` from the parent directory (deploys all files including the main project)
- `railway up --service cold-traffic-tool` without `--path-as-root` (still uploads from repo root)
- `railway up` from inside `cold-traffic-tool/` without `--path-as-root` (may still use git root)
