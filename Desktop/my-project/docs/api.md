# ITMS API 문서

## 개요

ITMS (지능형 테스트 관리 시스템) API는 테스트 계획, 실행, 결과 추적 및 결함 관리를 위한 RESTful API입니다.

## 기본 정보

- **Base URL**: `http://localhost:3001`
- **API 문서**: `http://localhost:3001/api-docs/`
- **인증**: JWT Bearer Token
- **Content-Type**: `application/json`

## 인증 (Authentication)

### 로그인
```http
POST /api/auth/login
```

**요청 본문:**
```json
{
  "email": "admin@test.com",
  "password": "password"
}
```

**응답:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin@test.com",
    "role": "ADMIN"
  }
}
```

### 사용자 등록
```http
POST /api/auth/register
```

**요청 본문:**
```json
{
  "username": "user@example.com",
  "password": "password",
  "role": "QA"
}
```

## 릴리즈 관리 (Releases)

### 모든 릴리즈 조회
```http
GET /api/releases
```

### 특정 릴리즈 조회
```http
GET /api/releases/{id}
```

### 릴리즈 생성
```http
POST /api/releases
```

**요청 본문:**
```json
{
  "name": "Quest v2.0",
  "version": "v2.0.0",
  "description": "릴리즈 설명",
  "startAt": "2024-01-01T00:00:00.000Z",
  "endAt": "2024-12-31T23:59:59.000Z",
  "assignee": "John"
}
```

### 릴리즈 실행 통계 조회
```http
GET /api/releases/{id}/execution-stats
```

**응답:**
```json
{
  "success": true,
  "data": {
    "planned": 5,
    "executed": 3,
    "passed": 2,
    "failed": 1,
    "blocked": 0,
    "skipped": 0,
    "passRate": 67
  },
  "message": "릴리즈 실행 통계를 성공적으로 조회했습니다."
}
```

### 릴리즈에 테스트케이스 추가
```http
POST /api/releases/{id}/testcases
```

**요청 본문:**
```json
{
  "testCaseIds": [1, 2, 3, 4, 5]
}
```

### 릴리즈 테스트케이스 조회
```http
GET /api/releases/{id}/testcases
```

## 테스트케이스 관리 (Test Cases)

### 테스트 폴더 조회
```http
GET /api/releases/folders
```

### 폴더별 테스트케이스 조회
```http
GET /api/releases/folders/{folderId}/testcases
```

### 테스트케이스 상태 변경
```http
PUT /api/releases/{id}/testcases/{testCaseId}/status
```

**요청 본문:**
```json
{
  "status": "Pass",
  "comment": "테스트 통과"
}
```

**사용 가능한 상태:**
- `Pass` - 통과
- `Fail` - 실패
- `Blocked` - 차단됨
- `Skip` - 건너뜀
- `Not Executed` - 실행 안됨

## 테스트케이스 관리 (Test Cases)

### 모든 테스트케이스 조회
```http
GET /api/testcases
```

### 특정 테스트케이스 조회
```http
GET /api/testcases/{id}
```

### 테스트케이스 생성
```http
POST /api/testcases
```

### 테스트케이스 수정
```http
PUT /api/testcases/{id}
```

### 테스트케이스 삭제
```http
DELETE /api/testcases/{id}
```

## 폴더 관리 (Folders)

### 모든 폴더 조회
```http
GET /api/folders
```

### 특정 폴더 조회
```http
GET /api/folders/{id}
```

### 폴더 생성
```http
POST /api/folders
```

### 폴더 수정
```http
PUT /api/folders/{id}
```

### 폴더 삭제
```http
DELETE /api/folders/{id}
```

## 트리 구조 (Tree)

### 트리 구조 조회
```http
GET /api/tree
```

### 트리 노드 생성
```http
POST /api/tree
```

### 트리 노드 수정
```http
PUT /api/tree/{id}
```

### 트리 노드 삭제
```http
DELETE /api/tree/{id}
```

## 실행 관리 (Executions)

### 실행 결과 조회
```http
GET /api/executions
```

### 실행 결과 생성
```http
POST /api/executions
```

### 실행 결과 수정
```http
PUT /api/executions/{id}
```

### 실행 결과 삭제
```http
DELETE /api/executions/{id}
```

## 에러 응답

모든 API는 에러 발생 시 다음과 같은 형식으로 응답합니다:

```json
{
  "success": false,
  "message": "에러 메시지"
}
```

### HTTP 상태 코드

- `200` - 성공
- `201` - 생성 성공
- `400` - 잘못된 요청
- `401` - 인증 실패
- `404` - 리소스를 찾을 수 없음
- `409` - 충돌 (중복 등)
- `500` - 서버 내부 오류

## 사용 예시

### 1. 로그인 후 릴리즈 생성

```bash
# 1. 로그인
curl -X POST "http://localhost:3001/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@test.com", "password": "password"}'

# 2. 릴리즈 생성 (토큰 사용)
curl -X POST "http://localhost:3001/api/releases" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Quest v2.0",
    "version": "v2.0.0",
    "startAt": "2024-01-01T00:00:00.000Z",
    "endAt": "2024-12-31T23:59:59.000Z"
  }'
```

### 2. 테스트케이스 추가 및 통계 확인

```bash
# 1. 테스트케이스 추가
curl -X POST "http://localhost:3001/api/releases/RELEASE_ID/testcases" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"testCaseIds": [1, 2, 3, 4, 5]}'

# 2. 실행 통계 확인
curl -X GET "http://localhost:3001/api/releases/RELEASE_ID/execution-stats" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 실시간 업데이트

릴리즈 실행 통계는 5초마다 자동으로 업데이트됩니다. 프론트엔드에서 실시간으로 변경사항을 확인할 수 있습니다.

## 추가 정보

더 자세한 API 문서는 Swagger UI를 통해 확인할 수 있습니다:
- **URL**: `http://localhost:3001/api-docs/`
- **기능**: API 테스트, 스키마 확인, 요청/응답 예시
