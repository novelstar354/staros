e-- Ban
UPDATE public.staros_accounts
SET
    is_banned = true,
    banned_at = now(),
    ban_reason = '利用規約違反'
WHERE username = 'ユーザー名';

DELETE FROM public.staros_sessions
WHERE user_id = (
    SELECT id
    FROM public.staros_accounts
    WHERE username = 'ユーザー名'
);

-- 解除
UPDATE public.staros_accounts
SET
    is_banned = false,
    banned_at = NULL,
    ban_reason = NULL
WHERE username = 'ユーザー名';

-- ban一覧
SELECT
    username AS "ユーザーネーム",
    display_name AS "表示名",
    id AS "userID",
    banned_at AS "BAN日時",
    ban_reason AS "BAN理由"
FROM public.staros_accounts
WHERE is_banned = true
ORDER BY banned_at DESC;

-- 一覧　ban,noramal含む
SELECT
    username AS "ユーザーネーム",
    display_name AS "表示名",
    id AS "userID",
    is_banned AS "BAN",
    banned_at AS "BAN日時",
    ban_reason AS "BAN理由",
    created_at AS "登録日時"
FROM public.staros_accounts
ORDER BY created_at ASC;


SELECT
    a.username AS "ユーザーネーム",
    a.display_name AS "表示名",
    'STAR-' || LPAD(
        ROW_NUMBER() OVER (ORDER BY a.created_at)::text,
        6,
        '0'
    ) AS "StarID",
    a.id AS "userID",
    a.password_hash AS "password hash",
    s.last_login AS "最終ログイン日時"
FROM public.staros_accounts AS a
LEFT JOIN (
    SELECT
        user_id,
        MAX(created_at) AS last_login
    FROM public.staros_sessions
    GROUP BY user_id
) AS s
    ON s.user_id = a.id
ORDER BY a.created_at;

-- 再設定
SELECT public.staros_admin_reset_password(
    'ここに管理者キー',
    '対象のUser ID',
    '新しいパスワード'
);

SELECT public.staros_admin_coin_adjust(
    'staruser01',
    'gift',
    500,
    'イベント報酬'
);

SELECT public.staros_admin_coin_adjust(
    'staruser01',
    'confiscate',
    300,
    '管理上の調整'
);

-- 全員配布
SELECT public.staros_admin_coin_broadcast(
    500::bigint,
    '全員配布イベント'
);



SELECT public.staros_admin_coin_reduce_all(
    100,
    '全員一律減額'
);


--log
SELECT *
FROM public.staros_coin_admin_log
ORDER BY created_at DESC
LIMIT 100;

--一覧
SELECT *
FROM public.staros_gifts
ORDER BY created_at DESC
LIMIT 100;


--履歴

-- StarOS：全取引履歴を時系列で一覧表示
-- 読み取り専用。データは変更・削除しません。

SELECT
    history_type AS "履歴の種類",
    occurred_at  AS "日時",
    details      AS "記録の詳細"
FROM (
    -- ユーザー間ギフト
    SELECT
        'ユーザー間ギフト'::text AS history_type,
        COALESCE(
            NULLIF(to_jsonb(g)->>'claimed_at', '')::timestamptz,
            NULLIF(to_jsonb(g)->>'created_at', '')::timestamptz
        ) AS occurred_at,
        to_jsonb(g) AS details
    FROM public.staros_user_gifts g

    UNION ALL

    -- ユーザー間の請求
    SELECT
        'ユーザー間請求',
        COALESCE(
            NULLIF(to_jsonb(r)->>'responded_at', '')::timestamptz,
            NULLIF(to_jsonb(r)->>'created_at', '')::timestamptz
        ),
        to_jsonb(r)
    FROM public.staros_coin_requests r

    UNION ALL

    -- StarCoinの増減・管理者による調整記録
    SELECT
        'StarCoin取引・管理ログ',
        NULLIF(to_jsonb(l)->>'created_at', '')::timestamptz,
        to_jsonb(l)
    FROM public.staros_coin_admin_log l

    UNION ALL

    -- 管理者から配布されたギフト
    SELECT
        '管理者配布ギフト',
        COALESCE(
            NULLIF(to_jsonb(g)->>'claimed_at', '')::timestamptz,
            NULLIF(to_jsonb(g)->>'created_at', '')::timestamptz
        ),
        to_jsonb(g)
    FROM public.staros_gifts g
) AS all_history
ORDER BY occurred_at DESC NULLS LAST;

--各ユーザー残高

SELECT
    username AS "UserID",
    balance  AS "現在のStarCoin残高"
FROM public.stazon_balances
ORDER BY username;

--全ユーザー
SELECT
    a.username AS "UserID",
    a.display_name AS "表示名",
    COALESCE(b.balance, 0) AS "StarCoin残高"
FROM public.staros_accounts AS a
LEFT JOIN public.stazon_balances AS b
    ON b.username = a.username
ORDER BY a.username ASC;


--all list
SELECT
    a.username AS "ユーザーネーム",
    a.display_name AS "表示名",
    'STAR-' || LPAD(
        ROW_NUMBER() OVER (ORDER BY a.created_at, a.id)::text,
        6,
        '0'
    ) AS "StarID",
    a.id AS "userID",
    a.password_hash AS "password hash",
    COALESCE(b.balance, 0) AS "StarCoin残高",
    a.is_banned AS "BAN",
    a.banned_at AS "BAN日時",
    a.ban_reason AS "BAN理由",
    a.created_at AS "登録日時",
    s.last_login AS "最終ログイン日時"
FROM public.staros_accounts AS a
LEFT JOIN public.stazon_balances AS b
    ON b.username = a.username
LEFT JOIN (
    SELECT
        user_id,
        MAX(created_at) AS last_login
    FROM public.staros_sessions
    GROUP BY user_id
) AS s
    ON s.user_id = a.id
ORDER BY a.created_at ASC, a.id ASC;
