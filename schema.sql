-- Create player_data table to store data for different KvK phases
CREATE TABLE IF NOT EXISTS player_data (
  id SERIAL PRIMARY KEY,
  governor_id VARCHAR(50) NOT NULL,
  governor_name VARCHAR(100) NOT NULL,
  power BIGINT NOT NULL,
  kill_points BIGINT NOT NULL,
  deads BIGINT NOT NULL,
  total_deads BIGINT DEFAULT 0, -- Thêm cột total_deads với giá trị mặc định là 0
  t1_kills BIGINT NOT NULL,
  t2_kills BIGINT NOT NULL,
  t3_kills BIGINT NOT NULL,
  t4_kills BIGINT NOT NULL,
  t5_kills BIGINT NOT NULL,
  phase VARCHAR(20) NOT NULL, -- 'dataStart', 'dataPass4', 'dataPass7', 'dataKingland'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create player_status table to track player statuses
CREATE TABLE IF NOT EXISTS player_status (
  id SERIAL PRIMARY KEY,
  governor_id VARCHAR(50) NOT NULL UNIQUE,
  governor_name VARCHAR(100) NOT NULL,
  on_leave BOOLEAN DEFAULT FALSE,
  zeroed BOOLEAN DEFAULT FALSE,
  farm_account BOOLEAN DEFAULT FALSE,
  blacklisted BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  event_type VARCHAR(50) NOT NULL, -- 'MGE', 'MoreThanGems', 'KvK', etc.
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_player_data_governor_id ON player_data(governor_id);
CREATE INDEX IF NOT EXISTS idx_player_data_phase ON player_data(phase);
CREATE INDEX IF NOT EXISTS idx_player_status_governor_id ON player_status(governor_id);

-- Thêm cột total_deads vào bảng player_data
ALTER TABLE player_data
ADD COLUMN IF NOT EXISTS total_deads BIGINT DEFAULT 0;

-- Cập nhật giá trị mặc định cho các bản ghi hiện có
UPDATE player_data
SET total_deads = 0
WHERE total_deads IS NULL; 