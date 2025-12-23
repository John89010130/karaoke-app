@echo off
echo ====================================
echo   TuneBuddy Pro - Servidor Local
echo ====================================
echo.
echo Iniciando servidor na porta 8080...
echo.
echo Acesse: http://localhost:8080
echo.
echo Pressione Ctrl+C para parar o servidor
echo.
echo ====================================
echo.

cd /d "%~dp0"
powershell -Command "Start-Process 'http://localhost:8080'; $listener = New-Object System.Net.HttpListener; $listener.Prefixes.Add('http://localhost:8080/'); $listener.Start(); Write-Host 'Servidor rodando em http://localhost:8080' -ForegroundColor Green; while ($listener.IsListening) { $context = $listener.GetContext(); $request = $context.Request; $response = $context.Response; $path = $request.Url.LocalPath; if ($path -eq '/') { $path = '/index.html' }; $filePath = Join-Path $PWD $path.TrimStart('/'); if (Test-Path $filePath) { $content = [System.IO.File]::ReadAllBytes($filePath); $response.ContentLength64 = $content.Length; $ext = [System.IO.Path]::GetExtension($filePath); switch ($ext) { '.html' { $response.ContentType = 'text/html' } '.js' { $response.ContentType = 'text/javascript' } '.css' { $response.ContentType = 'text/css' } '.jpg' { $response.ContentType = 'image/jpeg' } '.png' { $response.ContentType = 'image/png' } default { $response.ContentType = 'text/plain' } }; $response.OutputStream.Write($content, 0, $content.Length); } else { $response.StatusCode = 404; $buffer = [System.Text.Encoding]::UTF8.GetBytes('404 - Arquivo não encontrado'); $response.OutputStream.Write($buffer, 0, $buffer.Length); }; $response.Close(); }"

pause
