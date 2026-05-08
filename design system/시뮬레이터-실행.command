#!/bin/bash
# 더블클릭으로 로컬 HTTP 서버 + 브라우저 자동 실행
# (file:// 환경의 iframe CSS 로드 차단 우회)

# 이 스크립트의 상위 (SCM HUB 루트) 로 이동 → design system 과 scm hub 둘 다 서빙
cd "$(dirname "$0")/.."

PORT=8080

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🚀 SCM Hub 시뮬레이터 — 로컬 서버 시작"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  📁 작업 폴더: $(pwd)"
echo "  🌐 워크스페이스:  http://localhost:${PORT}/"
echo "  🌐 시뮬레이션:    http://localhost:${PORT}/design%20system/"
echo "  🌐 시뮬레이터:    http://localhost:${PORT}/design%20system/simulator/"
echo "  🌐 PRD 검증:     http://localhost:${PORT}/design%20system/prd-validate/"
echo "  🌐 SCM Hub 데모:  http://localhost:${PORT}/demo/dashboard.html"
echo ""
echo "  💡 사용 끝나면 이 창을 닫거나 Ctrl+C 누르세요."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1초 후 브라우저 자동 열기 (서버 부팅 대기) — 워크스페이스 진입점
(sleep 1 && open "http://localhost:${PORT}/") &

# Python 3 우선, 없으면 Python 2
if command -v python3 &> /dev/null; then
  python3 -m http.server ${PORT}
elif command -v python &> /dev/null; then
  python -m SimpleHTTPServer ${PORT}
else
  echo "❌ Python 이 설치되어 있지 않습니다."
  echo "   macOS 에는 보통 python3 이 기본 설치되어 있어요."
  echo "   터미널에서 python3 --version 확인해보세요."
  read -p "엔터 키를 눌러 종료..."
fi
