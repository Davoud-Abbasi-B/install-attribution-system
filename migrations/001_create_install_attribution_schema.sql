CREATE TABLE IF NOT EXISTS install_links (
  id BIGSERIAL PRIMARY KEY,
  token VARCHAR(64) UNIQUE NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  package_name VARCHAR(200) NOT NULL,
  campaign_name VARCHAR(200),
  media_source VARCHAR(100),
  channel VARCHAR(100),
  destination_store VARCHAR(50),
  destination_url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS install_clicks (
  id BIGSERIAL PRIMARY KEY,
  install_click_id UUID UNIQUE NOT NULL,
  install_link_id BIGINT NOT NULL REFERENCES install_links(id),
  token VARCHAR(64) NOT NULL,
  product_name VARCHAR(100),
  package_name VARCHAR(200),
  campaign_name VARCHAR(200),
  media_source VARCHAR(100),
  channel VARCHAR(100),
  ip_address INET,
  user_agent TEXT,
  device_os VARCHAR(50),
  redirect_url TEXT,
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS install_opens (
  id BIGSERIAL PRIMARY KEY,
  install_open_id UUID UNIQUE NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  package_name VARCHAR(200) NOT NULL,
  device_id VARCHAR(200) NOT NULL,
  store VARCHAR(50),
  install_click_id UUID,
  token VARCHAR(64),
  referrer_raw TEXT,
  attributed_install_click_id UUID,
  attribution_status VARCHAR(50) NOT NULL,
  app_version VARCHAR(50),
  os_version VARCHAR(50),
  opened_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_install_links_token ON install_links(token);
CREATE INDEX IF NOT EXISTS idx_install_clicks_install_click_id ON install_clicks(install_click_id);
CREATE INDEX IF NOT EXISTS idx_install_clicks_token ON install_clicks(token);
CREATE INDEX IF NOT EXISTS idx_install_clicks_campaign ON install_clicks(campaign_name, media_source);
CREATE INDEX IF NOT EXISTS idx_install_opens_install_click_id ON install_opens(install_click_id);
CREATE INDEX IF NOT EXISTS idx_install_opens_attributed_click_id ON install_opens(attributed_install_click_id);
CREATE INDEX IF NOT EXISTS idx_install_opens_device_product ON install_opens(product_name, device_id);
CREATE INDEX IF NOT EXISTS idx_install_opens_status ON install_opens(attribution_status);
CREATE INDEX IF NOT EXISTS idx_install_opens_opened_at ON install_opens(opened_at);
