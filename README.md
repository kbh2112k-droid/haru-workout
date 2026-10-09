# 하루운동 — 운동 기록 웹앱

기본 과제에 사용할 프로젝트입니다. 앞으로는 이 폴더의 소스를 기준으로 작업합니다.

## 현재 준비 상태

- 전체 소스 ZIP 압축 해제 완료
- 원본 소스 101개 파일 포함 여부 및 내용 확인 완료
- 프로젝트 설명과 폴더 안내 정리 완료
- GitHub 계정 연결, 도구 설치, 업로드 및 추가 배포는 아직 진행하지 않음
- 이번 준비 단계에서는 실행과 화면 테스트를 수행하지 않음

## 기능

- 걷기, 달리기, 근력 운동, 자전거 선택
- 운동한 날짜와 운동 시간(분) 저장
- 오늘의 총 운동 시간과 운동별 시간 표시
- 날짜순 기록 목록
- 큰 버튼과 밝은 디자인, 모바일 대응 화면

## 폴더 안내

| 위치 | 역할 |
| --- | --- |
| app/page.tsx | 운동 선택, 입력, 오늘 요약, 기록 목록 |
| app/globals.css | 색상, 글자 크기, 화면 배치 |
| app/layout.tsx | 페이지 제목과 기본 구성 |
| app/api/workouts/route.ts | 운동 기록 저장·조회 |
| components/ui | 화면에 쓰는 공통 부품 |
| lib | 공통 함수와 데이터베이스 연결 |
| db/schema.ts | 저장할 기록의 구조 |
| drizzle | 데이터베이스 테이블 생성 파일 |
| public | 사이트 아이콘 |
| scripts, build | 실행·게시용 도구 |
| .openai/hosting.json | 기존 Sites 연결 및 데이터베이스 설정 |
| package.json, package-lock.json | 필요한 도구와 고정된 설치 정보 |
| docs/original-starter-readme.md | 원래의 상세 기술 안내 |

## 다음 실습

1. Codex의 프로젝트 폴더로 이 `haru-workout` 폴더를 선택합니다.
2. GitHub 계정을 준비합니다.
3. Codex에 필요한 도구 설치와 GitHub 연결을 요청합니다.
4. 저장소와 공개 범위를 확인한 뒤 업로드하고 게시합니다.

기존 Sites 주소: https://daily-move-bogeum.kbh2112k.chatgpt.site

이 앱은 기록을 저장하는 서버와 Cloudflare D1 데이터베이스를 사용합니다. GitHub에는 소스를 보관할 수 있지만, GitHub Pages만으로는 현재의 저장 기능을 실행할 수 없습니다. 배포 단계에서 서버와 데이터베이스를 지원하는 호스팅을 연결해야 합니다.

소스 ZIP에는 실제로 저장된 운동 기록이 들어 있지 않습니다. 기존 사이트의 데이터베이스와 별도로 관리됩니다.

## 실행 안내 (도구 설치 단계에서 진행)

Node.js 22.13 이상과 npm이 필요합니다. 기존 package-lock.json을 유지합니다.

```sh
npm ci
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_workouts.sql
npm run dev
```

테이블 생성 명령은 새 로컬 데이터베이스에 한 번만 실행합니다. 실행 주소는 실행 도구가 안내하는 주소를 사용합니다. 자세한 환경 설명은 `docs/original-starter-readme.md`에 있습니다.
