param(
  [int]$Port = 4173
)

$ErrorActionPreference = "Stop"

$ProjectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")

$PythonCandidates = @(
  "python",
  "py",
  (Join-Path $env:USERPROFILE ".cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe")
)

$Python = $null
foreach ($Candidate in $PythonCandidates) {
  try {
    if ($Candidate -eq "py") {
      $Version = & $Candidate -3 --version 2>$null
    } else {
      $Version = & $Candidate --version 2>$null
    }

    if ($LASTEXITCODE -eq 0 -and $Version) {
      $Python = $Candidate
      break
    }
  } catch {
    continue
  }
}

if (-not $Python) {
  throw "No he encontrado Python. Instala Python o usa el runtime empaquetado de Codex."
}

Write-Host ""
Write-Host "Palmito Labs web local"
Write-Host "URL: http://localhost:$Port"
Write-Host "Carpeta: $ProjectRoot"
Write-Host "Pulsa Ctrl+C para parar el servidor."
Write-Host ""

if ($Python -eq "py") {
  & $Python -3 -m http.server $Port --bind 127.0.0.1 --directory $ProjectRoot
} else {
  & $Python -m http.server $Port --bind 127.0.0.1 --directory $ProjectRoot
}
