# day02/todo — 스티치 테마 Todo 앱

## 개요

스티치 캐릭터 테마의 Todo 앱. 순수 HTML/CSS/JS로 구성되며 Supabase를 통해 클라우드 DB에 데이터를 저장한다.

## 실행 방법

빌드 불필요. `index.html`을 브라우저에서 직접 열면 된다.

배포 URL: https://tlswldnjs716.github.io/todo-app/

## 파일 구조

```
todo/
├── index.html        # 마크업 + Supabase SDK CDN 로드
├── app.js            # 전체 로직 (CRUD, 렌더, Supabase 연동)
├── style.css         # 스티치 테마 스타일
├── stitch.png        # 스티치 이미지
├── CLAUDE.md         # 이 파일
└── GITHUB_PAGES.md   # GitHub Pages 배포 가이드
```

## 아키텍처

- **저장소**: Supabase PostgreSQL (클라우드)
- **인증**: 없음 (anon key + RLS allow all 정책)
- **배포**: GitHub Pages (`tlswldnjs716/todo-app` 레포)

## Supabase 설정

- **Project URL**: `https://ggpjhrfeujjsloelerax.supabase.co`
- **테이블**: `todos`
- **RLS 정책**: `allow all` (누구나 읽기/쓰기 가능)

### 테이블 스키마

```sql
create table todos (
  id         bigint generated always as identity primary key,
  text       text        not null,
  completed  boolean     not null default false,
  priority   text        not null default 'mid',
  created_at timestamptz not null default now()
);
```

## 주요 기능

- 할 일 추가 / 완료 토글 / 삭제
- 우선순위 설정 (높음 / 보통 / 낮음)
- 필터 탭 (전체 / 진행중 / 완료)
- 배경 버블 애니메이션

## 코드 수정 후 GitHub Pages 반영

```bash
cd /tmp/todo-app
git add .
git commit -m "update: 변경 내용"
git push origin main
```
