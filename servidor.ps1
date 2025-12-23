# Servidor HTTP Simples para TuneBuddy Pro
$port = 8080
$url = "http://localhost:$port/"

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  TuneBuddy Pro - Servidor Local" -ForegroundColor Yellow
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Iniciando servidor na porta $port..." -ForegroundColor Green
Write-Host "Acesse: $url" -ForegroundColor Yellow
Write-Host "Pressione Ctrl+C para parar" -ForegroundColor Red
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Start-Process $url

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)
$listener.Start()

Write-Host "Servidor rodando!" -ForegroundColor Green
Write-Host ""

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $path = $request.Url.LocalPath
        if ($path -eq '/') { $path = '/index.html' }
        
        $filePath = Join-Path $PSScriptRoot $path.TrimStart('/')
        
        Write-Host "$(Get-Date -Format 'HH:mm:ss') - $($request.HttpMethod) $path" -ForegroundColor Cyan
        
        if (Test-Path $filePath) {
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $content.Length
            
            $ext = [System.IO.Path]::GetExtension($filePath)
            $response.ContentType = switch ($ext) {
                '.html' { 'text/html' }
                '.js'   { 'text/javascript' }
                '.css'  { 'text/css' }
                '.jpg'  { 'image/jpeg' }
                '.png'  { 'image/png' }
                default { 'text/plain' }
            }
            
            $response.AddHeader('Access-Control-Allow-Origin', '*')
            $response.OutputStream.Write($content, 0, $content.Length)
            
            Write-Host "  200 OK" -ForegroundColor Green
        }
        else {
            $response.StatusCode = 404
            $error404 = '<html><body><h1>404 - Nao encontrado</h1></body></html>'
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($error404)
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            
            Write-Host "  404 Not Found" -ForegroundColor Red
        }
        
        $response.Close()
    }
}
finally {
    $listener.Stop()
    $listener.Close()
    Write-Host "Servidor encerrado" -ForegroundColor Yellow
}
