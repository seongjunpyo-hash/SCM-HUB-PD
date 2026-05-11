---
allowed-tools: Bash(git status:*), Bash(git branch:*), Bash(git log:*), Bash(git diff:*), Bash(git push:*), Bash(gh:*), Bash(which:*)
description: Git 상태 자동 분석 → 브랜치 push → 한글 PR 생성 (draft 기본)
---

# Claude Command: PR Create

이 명령어는 GitHub에서 Pull Request를 생성하는 데 도움을 줍니다. 한국어로 PR 내용을 작성하며, 기본적으로 draft 상태로 생성됩니다.

## 자동 실행 명령어

다음 명령어들이 자동으로 실행되어 컨텍스트에 포함됩니다:

- 현재 브랜치: !`git branch --show-current`
- Git 상태: !`git status`
- 최근 커밋 로그 (10개): !`git log -10 --oneline`

## 사용법

기본 사용법 (draft PR 생성):

```bash
/pr-create
```

옵션과 함께:

```bash
/pr-create --open    # 일반 PR로 생성 (draft 아님)
/pr-create --draft   # 명시적으로 draft PR로 생성
```

## 명령어 옵션

- `--open`: 일반 PR로 생성 (draft 상태가 아님)
- `--draft`: 명시적으로 draft PR로 생성 (기본값)

## GitHub 통신

- GitHub CLI (`gh pr`) 우선 사용 (rate limit 안정적, `gh pr create --assignee @me`)
- 실패 시 GitHub MCP 사용

## PR 생성 과정

### 1단계: 브랜치 확인 및 Push

- 자동 실행된 현재 브랜치 정보 확인
- 현재 브랜치를 원격 저장소에 push (`git push origin <branch>`)
- **Push 실패 시 에러 메시지 출력 후 중단**
- 자동 실행된 커밋 로그로 base 브랜치와의 차이점 분석
- 자동 수집된 commit 히스토리 검토

### 2단계: PR 내용 및 AI 기여도 요약 생성

- **한국어로 제목과 본문 작성**
- **제목 형식**: `타입: 변경사항 요약` (예: `feat: 다중 인증 시스템 추가`)
- 변경 사항을 요약하여 설명
- 테스트 계획 및 체크리스트 포함
- **커밋 메시지를 분석하여 AI 기여도 요약 생성** (평균 기여도만 간단히 표시)

### 3단계: 사용자 검증 및 승인

- 생성된 PR 내용을 사용자에게 표시
- AI 기여도 분석 요약 미리보기 표시 (평균 기여도만)
- 사용자 승인 및 선택적 기여도 비율 입력 받기:
  - `y`, `ㅇ`, `ㄱ` 등 긍정 응답: PR 생성 (AI 분석 기여도 그대로 사용)
  - `"50:50"`, `"3:7"` 등 수치:수치 형식: PR 생성 + 사용자 체감 비율 기록
  - `"내가다해먹음"`, `"반반"`, `"AI가 거의 다했다"` 등 서술형: PR 생성 + 서술형을 수치로 변환하여 기록
  - `n`, `ㄴ` 등 부정 응답: PR 생성 취소
- **사용자가 비율을 입력한 경우**: PR 본문 하단에 다음 형식으로 추가

  ```markdown
  ---

  ## 📝 사용자 체감 기여도

  **사용자**: 60% | **AI**: 40%

  > 위 비율은 PR 작성자가 주관적으로 평가한 전체 기여도입니다.
  ```

### 4단계: PR 생성 및 링크 제공

- 우선: GitHub CLI (`gh pr`) 명령어 사용 (rate limit에 덜 취약함)
- 차선책: GitHub MCP 사용 (GitHub CLI 실패 시에만 사용)
- 본인을 assignee로 설정
- 생성된 PR URL 제공
- draft 상태 여부 확인

## 출력 형식

```text
=== 생성될 Pull Request 내용 ===
제목: feat: 사용자 인증 시스템 개선
본문: [변경사항 + 테스트 계획 포함]

=== AI 기여도 요약 (미리보기) ===
평균 기여도: 사용자 35% | AI 65%
💡 상세 분석은 PR 머지 후 자동으로 코멘트로 추가됩니다.

=== 승인 여부 입력 ===
y/n 또는 "50:50", "반반" 등 기여도 비율 입력
>
```

## PR 본문 템플릿

```markdown
## 변경사항

- 주요 변경사항 1
- 주요 변경사항 2
- 주요 변경사항 3

## 테스트 계획

- [ ] 로컬 환경에서 정상 동작 확인
- [ ] 타입 체크 통과 (`pnpm type-check:all`)
- [ ] Lint 검사 통과 (`pnpm lint`)
- [ ] 테스트 통과 (`pnpm test:run`)
- [ ] Storybook 빌드 검증 (`pnpm validate:storybook`)

## 스크린샷 (선택사항)

<!-- 필요시 스크린샷 추가 -->

---

**AI 기여도 요약**: 평균 사용자 35% | AI 65%

> 💡 상세 분석은 PR 머지 후 자동으로 코멘트로 추가됩니다.
```

## 모범 사례

- Push 전 확인: PR 생성 전에 브랜치가 성공적으로 push되는지 확인 (pre-push 훅 통과 필요)
- 자동 Assignee 설정: PR 생성 시 본인을 assignee로 자동 설정하여 책임 명확화
- 명확한 제목: 변경 사항을 한 문장으로 요약
- 구체적인 설명: 왜 이 변경이 필요한지, 무엇을 개선하는지 설명
- 테스트 계획: 어떻게 테스트했는지, 어떤 점을 확인해야 하는지 명시
- 체크리스트: 리뷰어가 확인해야 할 항목들 나열

## PR 제목 예시

- feat: 로그인 페이지 UI 개선
- fix: 인증 스토어 타입 에러 수정
- refactor: 공통 컴포넌트 구조 개선
- docs: README에 환경 설정 가이드 추가
- test: LoginForm 테스트 커버리지 추가
