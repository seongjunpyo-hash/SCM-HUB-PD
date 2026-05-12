---
allowed-tools: Bash(git status:*), Bash(git branch:*), Bash(git diff:*), Bash(git add:*), Bash(git commit:*), Bash(git checkout:*), Bash(git log:*)
description: Conventional Commits 형식으로 commit 메시지를 생성하고, 사용자 승인 후 git commit 실행
---

# Claude Command: Commit

이 명령어는 [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) 형식으로 commit 메시지를 생성하고 실행합니다.

**⚠️ 중요: Claude는 이 파일의 모든 명세를 정확히 따라야 합니다. 특히 main/master 브랜치 체크는 필수입니다.**

---

## 🚨 컨텍스트 압축 후에도 반드시 지켜야 할 필수 체크리스트

**커밋 메시지는 아래 5가지 필수 요소를 모두 포함해야 합니다:**

### ✅ 1. 제목 형식

```
[type]: [한글 제목]
```

- 예: `feat: 사용자 인증 시스템 추가`
- 이 프로젝트는 Jira 티켓을 사용하지 않으므로 티켓 번호 불필요

### ✅ 2. 변경사항 목록 (별표 사용)

```
* 첫 번째 변경사항
* 두 번째 변경사항
```

- **주의**: `-` 대신 반드시 `*` 사용

### ✅ 3. 기여도 섹션 (필수)

```
## 변경사항 (사용자: X% | AI: Y%)
### 사용자 기여 (X%):
* 아이디어 제시, 방향성 결정 등

### AI 기여 (Y%):
* 코드 작성, 테스트 등
```

- 기여도는 코드 라인 수가 아닌 **아이디어/설계/의사결정의 출처**로 판단

### ✅ 4. AI 작업 메트릭 (필수)

```
## AI 작업 메트릭 (AI Metrics)
* **모델**: Claude Sonnet 4.5
* **토큰 사용량**: Input 15,000 / Output 8,500 (Total: 23,500)
* **대화 턴 수**: 3회
* **주요 작업**: 코드 작성, 디버깅
```

- **⚠️ 측정 범위**: 토큰 사용량, 대화 턴 수, 주요 작업 모두 **해당 커밋 작업에 직접 관련된 것만** 집계
- **토큰 사용량 작성 우선순위**:
  1. **최우선**: Input/Output을 분리할 수 있다면 `Input X / Output Y (Total: Z)` 형식으로 작성
  2. **차선책**: Input/Output 분리가 불가능하면 `Total: Z` 형식으로만 작성
  3. **최후**: 토큰 사용량을 전혀 알 수 없는 경우에만 해당 줄 생략

### ✅ 5. Co-author (필수)

```
Co-authored-By: Claude <noreply@anthropic.com>
```

---

## 자동 실행 Git 명령어

다음 명령어들이 자동으로 실행되어 컨텍스트에 포함됩니다:

- 현재 브랜치: !`git branch --show-current`
- Git 상태: !`git status`
- Staged 변경사항: !`git diff --cached`
- Unstaged 변경사항: !`git diff`
- 최근 커밋 로그 (3개): !`git log -3 --oneline`

## 사용법

기본 사용법 (commit 메시지만 생성):

```bash
/commit
```

옵션과 함께:

```bash
/commit --auto           # 자동으로 commit까지 실행
/commit --auto-no-verify # 자동 commit 실행 (사전 검사 제외)
```

## 명령어 옵션

- `--auto`: commit 메시지 생성 후 자동으로 commit까지 실행 (사전 검사 포함)
- `--auto-no-verify`: commit 메시지 생성 후 자동으로 commit까지 실행 (사전 검사 제외)

## 이 명령어가 하는 일

### 기본 모드 (`/commit`)

1. 현재 브랜치가 main 또는 master인지 확인합니다.
   - 위의 "자동 실행 Git 명령어" 섹션에서 실행된 `현재 브랜치` 결과를 확인합니다.
   - main/master 브랜치인 경우: main 브랜치에서는 직접 커밋이 불가하므로 임시 브랜치 생성 여부를 묻습니다
     - "main 브랜치에서는 직접 커밋할 수 없습니다. 임시 브랜치를 생성하시겠습니까? (y/n)" 질문
     - 'y' 또는 긍정적 응답: `git checkout -b temp/브랜치명` 으로 임시 브랜치 생성 후 체크아웃하여 커밋 과정 계속 진행
     - 'n' 또는 부정적 응답: 커밋 과정을 중단하고 브랜치 생성 가이드 제공

2. Staging 상태 확인 및 처리:
   - 위의 "자동 실행 Git 명령어" 섹션에서 실행된 `Git 상태`, `Staged 변경사항`, `Unstaged 변경사항` 결과를 확인합니다.
   - 조건 분기:
     - A. Staging된 파일이 있는 경우:
       - 절대로 추가적으로 staging하거나 unstaging하지 않습니다
       - 사용자가 의도적으로 특정 파일만 staging한 것이므로 존중합니다
     - B. Staging된 파일이 없는 경우:
       - `git add .`로 모든 수정된 파일과 새 파일을 자동 추가

3. 변경사항 분석:
   - 자동 실행된 diff 결과를 분석하여 여러 개의 논리적으로 구분되는 변경사항이 있는지 확인합니다.
   - 여러 개의 구분되는 변경사항이 감지되면 commit을 여러 개의 작은 commit으로 나누도록 제안합니다.

4. Commit 메시지 생성:
   - 각 commit에 대해 Conventional Commits 형식으로 commit 메시지를 생성합니다.
   - Commit 메시지는 한글로 작성합니다.
   - Commit 메시지에서 목록은 `*`로 표현합니다 (- 대신 \* 사용)
   - 기여도 정보를 추가합니다:
     - `## 변경사항 (사용자: X% | AI: Y%)` 섹션 추가
     - 사용자와 AI의 기여 내용을 각각 명시
   - AI 작업 메트릭을 추가합니다:
     - `## AI 작업 메트릭 (AI Metrics)` 섹션 추가
   - AI Co-authored-By를 무조건 추가합니다:
     - 형식: `Co-authored-By: Claude <noreply@anthropic.com>`

5. Commit 메시지 출력 및 확인:
   - 생성된 commit 메시지를 보여주고 "이대로 commit 해드릴까요? (y/n)" 질문을 합니다.

6. Commit 실행:
   - 사용자가 긍정하면 실제 commit을 실행합니다.
   - 다양한 긍정적 응답(예: 'ㅇ', 'ㄱ', 'ㅇㅇ', 'ㄱㄱ', 'rr', 'yes', 'Y', '예', '응') 인식

### 자동 모드 (`/commit --auto`)

1. 자동으로 사전 commit 검사를 실행합니다:
   - `pnpm validate` 실행으로 코드 품질 확인
   - 사전 검사가 실패하면 오류 메시지를 표시하고 중단합니다.
2. 위의 기본 모드 1-4단계를 실행하고 commit 메시지를 생성합니다.
3. 사용자 확인 없이 생성된 commit 메시지로 `git commit -m "메시지"` 를 자동 실행합니다.

### 자동 모드 (검사 제외) (`/commit --auto-no-verify`)

1. 사전 commit 검사를 건너뜁니다.
2. 위의 기본 모드 1-4단계를 실행하고 commit 메시지를 생성합니다.
3. 사용자 확인 없이 생성된 commit 메시지로 `git commit -m "메시지"` 를 자동 실행합니다.

## Commit 모범 사례

- main 브랜치 보호: main/master 브랜치에서 직접 커밋 금지
- Commit 전 검증: 린트, 타입 체크, 테스트 확인
- Atomic commit: 각 commit은 단일 목적만 포함
- 큰 변경사항 분할: 여러 관심사는 별도의 commit으로 분할
- Conventional Commits 형식 사용:
  - `feat`: 새로운 기능
  - `fix`: 버그 수정
  - `docs`: 문서 변경
  - `style`: 코드 스타일 변경 (포맷팅 등)
  - `refactor`: 버그 수정이나 기능 추가가 아닌 코드 변경
  - `perf`: 성능 개선
  - `test`: 테스트 추가 또는 수정
  - `chore`: 빌드 프로세스, 도구 등의 변경
  - `ci`: CI/CD 설정 변경

## 기여도 산정 가이드라인

모든 커밋 메시지에는 사용자와 AI의 기여도를 명시해야 합니다.

### 기여도 산정 원칙

**⚠️ 중요**: 기여도는 단순 코드 라인 수가 아니라, **로직의 핵심 아이디어**, **구조적 설계 결정**, **문제 해결 방향성**을 중심으로 산정합니다.

### 사용자 기여 인정 기준

- 💡 **아이디어/기획**: 문제 식별, 해결책 제안, 기술 선택 방향성 제시
- 🎯 **방향성 설정**: 작업 범위 정의, 우선순위 결정, 요구사항 명세
- 📋 **의사결정**: 라이브러리 선택, 아키텍처 결정, 디자인 패턴 선택
- 🔍 **검토/피드백**: 코드 리뷰, 수정 요청, 품질 검증, 테스트 검수

### AI 기여 인정 기준

- 💻 **코드 구현**: 실제 코드 작성, 파일 수정, 컴포넌트 개발
- 🔧 **기술적 해결**: 상세 구현 방법, 오류 해결, 최적화 작업
- 🧪 **테스트/검증**: 코드 테스트, 오류 수정, 품질 보증
- 📚 **문서화**: 주석 작성, README 업데이트, 가이드 작성

## 출력 형식

Commit 메시지는 다음과 같이 간결하게 출력됩니다:

```text
feat: 사용자 인증 시스템 추가

* LoginForm 컴포넌트 구현 (src/features/auth/components/LoginForm.tsx)
* Zustand 기반 인증 스토어 추가 (src/features/auth/store/auth-store.ts)
* Protected Route 컴포넌트 추가 (src/app/components/ProtectedRoute.tsx)

## 변경사항 (사용자: 50% | AI: 50%)
### 사용자 기여 (50%):
* 인증 시스템 아키텍처 설계
* Zustand 상태 관리 방식 결정
* UI/UX 요구사항 명세

### AI 기여 (50%):
* LoginForm 컴포넌트 코드 작성
* 인증 스토어 구현
* 타입 정의 및 테스트 작성

## AI 작업 메트릭 (AI Metrics)
* **모델**: Claude Sonnet 4.5
* **토큰 사용량**: Input 15,000 / Output 8,500 (Total: 23,500)
* **대화 턴 수**: 3회
* **주요 작업**: 코드 작성, 컴포넌트 개발

Co-authored-By: Claude <noreply@anthropic.com>
```

## 예시

### 좋은 commit 메시지

- feat: 사용자 인증 시스템 추가
- fix: 로그인 폼 검증 오류 수정
- docs: README에 개발 환경 설정 가이드 추가
- refactor: 공통 컴포넌트 구조 개선
- test: LoginForm 컴포넌트 테스트 추가
- chore: ESLint 설정 업데이트
