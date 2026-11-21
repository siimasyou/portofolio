Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $PSScriptRoot
$out = Join-Path $root 'assets\img\og.jpg'
$canvas = New-Object System.Drawing.Bitmap 1200,630
$g = [System.Drawing.Graphics]::FromImage($canvas)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.Clear([System.Drawing.Color]::FromArgb(31,51,80))
$peach = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(244,169,138))
$mint = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(180,227,207))
$g.FillEllipse($peach, 970, 42, 150, 150)
$g.FillEllipse($mint, 78, 480, 110, 110)
$fontBig = New-Object System.Drawing.Font('Arial', 72, [System.Drawing.FontStyle]::Bold)
$fontSmall = New-Object System.Drawing.Font('Arial', 28, [System.Drawing.FontStyle]::Regular)
$white = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
$butter = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255,240,179))
$g.DrawString('Atin', $fontBig, $butter, 80, 110)
$g.DrawString("Nur'jannah", $fontBig, $white, 80, 195)
$g.DrawString('Portofolio | Pendidikan Biologi, media sosial, dan konten', $fontSmall, $white, 84, 310)
$photo = [System.Drawing.Image]::FromFile((Join-Path $root 'assets\img\foto-wisuda.jpg'))
$g.DrawImage($photo, (New-Object System.Drawing.Rectangle(760, 210, 330, 390)))
$canvas.Save($out, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$photo.Dispose(); $g.Dispose(); $canvas.Dispose()
