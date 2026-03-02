# 🛠️ Frontend Build Fix - "Too Many Open Files" Error

## Problem
```
EMFILE: too many open files, open 'node_modules/@mui/icons-material/esm/ScatterPlot.js'
```

This is a **Windows system limitation**, not a code error. Windows has a default limit on open file handles.

---

## ✅ Solutions (Try in Order)

### Solution 1: Increase Windows File Handle Limit (Recommended)

#### Using PowerShell (Admin):
```powershell
# Check current limit
Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\SubSystems" -Name "Windows"

# This requires Windows Subsystem for Linux (WSL) adjustment
# Or use the Node.js workaround below
```

#### Quick Fix - Set NODE_OPTIONS:
```bash
# In PowerShell (before building)
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

---

### Solution 2: Close Unnecessary Applications

1. **Close** file explorers, text editors, and other applications
2. **Close** unnecessary Node.js processes
3. **Restart** your computer (clears file handles)
4. **Try building again** immediately after restart

---

### Solution 3: Use WSL2 (Best Long-term Solution)

Windows Subsystem for Linux doesn't have this limitation:

#### Install WSL2:
```powershell
# In PowerShell (Admin)
wsl --install
```

#### Build in WSL:
```bash
# After installing WSL
wsl
cd /mnt/c/Users/tech1/OneDrive/Desktop/edizo/Main-Webpage/frontend
npm run build
```

---

### Solution 4: Reduce MUI Icons Import

If you're importing all MUI icons, change to individual imports:

**❌ Bad (imports all icons):**
```javascript
import { ScatterPlot, Home, Settings } from '@mui/icons-material';
```

**✅ Good (imports only what you need):**
```javascript
import ScatterPlot from '@mui/icons-material/ScatterPlot';
import Home from '@mui/icons-material/Home';
import Settings from '@mui/icons-material/Settings';
```

Or use path imports:
```javascript
import ScatterPlot from '@mui/icons-material/ScatterPlot';
```

---

### Solution 5: Increase File Handle Limit via Registry

**⚠️ Warning: Edit registry carefully!**

1. Press `Win + R`, type `regedit`
2. Navigate to: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager`
3. Find or create `SubSystems` key
4. Modify the `Windows` value
5. Add/modify: `SharedSection=1024,20480,768`
6. **Restart computer**

---

### Solution 6: Use Build with Reduced Parallelism

```bash
# Set max concurrent operations
$env:VITE_BUILD_CONCURRENCY=1
npm run build
```

---

### Solution 7: Clean and Reinstall

```bash
# In frontend directory
rm -rf node_modules
rm package-lock.json
npm cache clean --force
npm install
npm run build
```

---

## 🚀 Quick Fix Script (PowerShell)

Create `fix-build.ps1` in frontend directory:

```powershell
# Fix-Build.ps1
Write-Host "🔧 Fixing Windows file handle limit..." -ForegroundColor Cyan

# Set Node.js memory limit
$env:NODE_OPTIONS="--max-old-space-size=4096"

# Set build concurrency
$env:VITE_BUILD_CONCURRENCY=1

Write-Host "📦 Cleaning node_modules..." -ForegroundColor Yellow
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue

Write-Host "📥 Reinstalling dependencies..." -ForegroundColor Yellow
npm install

Write-Host "🏗️  Building..." -ForegroundColor Green
npm run build
```

Run with:
```powershell
.\fix-build.ps1
```

---

## ✅ Recommended Approach

**For Immediate Fix:**
```bash
# Close all unnecessary applications
# Then build with increased memory
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

**For Long-term:**
- Use **WSL2** for development
- Or increase Windows file handle limit via registry

---

## 📊 Verification

After applying fix, build should complete successfully:
```
✓ xxxx modules transformed.
✓ built in x.xx s
```

---

## 🔗 Additional Resources

- [Node.js Memory Options](https://nodejs.org/api/cli.html#cli_max_old_space_size_size_in_megabytes)
- [WSL2 Installation Guide](https://docs.microsoft.com/en-us/windows/wsl/install)
- [Windows File Handle Limits](https://learn.microsoft.com/en-us/windows/win32/sysinfo/registry-key-security)
