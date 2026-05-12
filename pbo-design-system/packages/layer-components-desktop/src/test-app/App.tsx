import { StatusTag } from '@/components/Tags';

export function App() {
  return (
    <div style={{ width: 1000, padding: 32, display: 'flex', flexDirection: 'column', gap: 64 }}>
      {/* 헤더 */}
      <header style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700 }}>StatusTag 컴포넌트 가이드</h1>
        <p style={{ margin: 0, fontSize: 16, color: '#666' }}>
          StatusTag는 상태를 나타내는 태그 컴포넌트입니다. 다양한 variant, emphasis, size 옵션을 제공합니다.
        </p>
      </header>

      {/* 기본 사용법 */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>기본 사용법</h2>
          <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
            가장 간단한 형태의 StatusTag입니다. variant를 지정하지 않으면 기본값인 'default'가 적용됩니다.
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            alignItems: 'center',
            padding: 16,
            backgroundColor: '#f9f9f9',
            borderRadius: 8,
          }}
        >
          <StatusTag variant="default" label="명시적 default" />
        </div>
      </section>

      {/* Variant 케이스 */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Variant</h2>
          <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
            StatusTag의 상태를 나타내는 variant입니다. default, success, warning, critical, progress 중 하나를 선택할 수
            있습니다.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>기본 Variants</h3>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
                alignItems: 'center',
                padding: 16,
                backgroundColor: '#f9f9f9',
                borderRadius: 8,
              }}
            >
              <StatusTag variant="default" label="default" />
              <StatusTag variant="success" label="success" />
              <StatusTag variant="warning" label="warning" />
              <StatusTag variant="critical" label="critical" />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>Progress Variant</h3>
            <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
              progress variant는 진행 상태를 나타내며, progressType prop과 함께 사용해야 합니다.
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
                alignItems: 'center',
                padding: 16,
                backgroundColor: '#f9f9f9',
                borderRadius: 8,
              }}
            >
              <StatusTag variant="progress" progressType="primary" label="progress (primary)" />
              <StatusTag variant="progress" progressType="secondary" label="progress (secondary)" />
              <StatusTag variant="progress" progressType="tertiary" label="progress (tertiary)" />
            </div>
          </div>
        </div>
      </section>

      {/* ProgressType 케이스 */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>ProgressType</h2>
          <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
            variant가 'progress'일 때만 사용할 수 있는 prop입니다. primary, secondary, tertiary 중 하나를 선택할 수
            있습니다.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              alignItems: 'center',
              padding: 16,
              backgroundColor: '#f9f9f9',
              borderRadius: 8,
            }}
          >
            <StatusTag variant="progress" progressType="primary" label="primary" />
            <StatusTag variant="progress" progressType="secondary" label="secondary" />
            <StatusTag variant="progress" progressType="tertiary" label="tertiary" />
          </div>
        </div>
      </section>

      {/* Emphasis 케이스 */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Emphasis</h2>
          <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
            태그의 강조 정도를 나타냅니다. solid는 기본 강조, subtle은 약한 강조입니다. subtle일 때는 badge가 true여야
            합니다.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>Solid Emphasis</h3>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
                alignItems: 'center',
                padding: 16,
                backgroundColor: '#f9f9f9',
                borderRadius: 8,
              }}
            >
              <StatusTag variant="default" emphasis="solid" label="default" />
              <StatusTag variant="success" emphasis="solid" label="success" />
              <StatusTag variant="warning" emphasis="solid" label="warning" />
              <StatusTag variant="critical" emphasis="solid" label="critical" />
              <StatusTag variant="progress" progressType="primary" emphasis="solid" label="progress" />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>Subtle Emphasis</h3>
            <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
              subtle emphasis를 사용할 때는 반드시 badge={true}를 함께 사용해야 합니다.
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
                alignItems: 'center',
                padding: 16,
                backgroundColor: '#f9f9f9',
                borderRadius: 8,
              }}
            >
              <StatusTag variant="default" emphasis="subtle" badge={true} label="default" />
              <StatusTag variant="success" emphasis="subtle" badge={true} label="success" />
              <StatusTag variant="warning" emphasis="subtle" badge={true} label="warning" />
              <StatusTag variant="critical" emphasis="subtle" badge={true} label="critical" />
              <StatusTag variant="progress" progressType="primary" emphasis="subtle" badge={true} label="progress" />
            </div>
          </div>
        </div>
      </section>

      {/* Size 케이스 */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Size</h2>
          <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
            태그의 크기를 설정합니다. xsmall, small, medium 중 하나를 선택할 수 있습니다. 기본값은 medium입니다.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              alignItems: 'center',
              padding: 16,
              backgroundColor: '#f9f9f9',
              borderRadius: 8,
            }}
          >
            <StatusTag variant="default" size="xsmall" label="xsmall" />
            <StatusTag variant="default" size="small" label="small" />
            <StatusTag variant="default" size="medium" label="medium" />
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              alignItems: 'center',
              padding: 16,
              backgroundColor: '#f9f9f9',
              borderRadius: 8,
            }}
          >
            <StatusTag variant="success" size="xsmall" label="xsmall" />
            <StatusTag variant="success" size="small" label="small" />
            <StatusTag variant="success" size="medium" label="medium" />
          </div>
        </div>
      </section>

      {/* Badge 케이스 */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Badge</h2>
          <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
            태그 왼쪽에 배지를 표시합니다. emphasis가 'subtle'일 때는 badge가 true여야 합니다.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>Badge: false (기본값)</h3>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
                alignItems: 'center',
                padding: 16,
                backgroundColor: '#f9f9f9',
                borderRadius: 8,
              }}
            >
              <StatusTag variant="default" badge={false} label="태그" />
              <StatusTag variant="success" badge={false} label="태그" />
              <StatusTag variant="warning" badge={false} label="태그" />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>Badge: true</h3>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
                alignItems: 'center',
                padding: 16,
                backgroundColor: '#f9f9f9',
                borderRadius: 8,
              }}
            >
              <StatusTag variant="default" badge={true} label="태그" />
              <StatusTag variant="success" badge={true} label="태그" />
              <StatusTag variant="warning" badge={true} label="태그" />
              <StatusTag variant="progress" progressType="primary" badge={true} label="태그" />
            </div>
          </div>
        </div>
      </section>

      {/* InfoIcon 케이스 */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>InfoIcon</h2>
          <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
            태그 오른쪽에 정보 아이콘을 표시합니다. 추가 정보가 필요할 때 사용합니다.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              alignItems: 'center',
              padding: 16,
              backgroundColor: '#f9f9f9',
              borderRadius: 8,
            }}
          >
            <StatusTag variant="default" infoIcon={false} label="아이콘 없음" />
            <StatusTag variant="default" infoIcon={true} label="아이콘 있음" />
            <StatusTag variant="success" infoIcon={true} label="성공 + 아이콘" />
            <StatusTag variant="warning" infoIcon={true} label="경고 + 아이콘" />
            <StatusTag variant="progress" progressType="primary" infoIcon={true} label="진행중 + 아이콘" />
          </div>
        </div>
      </section>

      {/* Count 케이스 */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Count</h2>
          <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
            태그에 숫자를 표시합니다. 개수나 수량을 나타낼 때 사용합니다.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              alignItems: 'center',
              padding: 16,
              backgroundColor: '#f9f9f9',
              borderRadius: 8,
            }}
          >
            <StatusTag variant="default" label="태그" count={5} />
            <StatusTag variant="success" label="태그" count={99} />
            <StatusTag variant="warning" label="태그" count={999} />
            <StatusTag variant="critical" label="태그" count={1} />
            <StatusTag variant="progress" progressType="primary" label="태그" count={100} />
          </div>
        </div>
      </section>

      {/* Size + InfoIcon 조합 */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Size + InfoIcon 조합</h2>
          <p style={{ margin: 0, fontSize: 14, color: '#666' }}>다양한 size와 infoIcon의 조합 예제입니다.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              alignItems: 'center',
              padding: 16,
              backgroundColor: '#f9f9f9',
              borderRadius: 8,
            }}
          >
            <StatusTag variant="default" size="xsmall" infoIcon={true} label="xsmall + icon" />
            <StatusTag variant="default" size="small" infoIcon={true} label="small + icon" />
            <StatusTag variant="default" size="medium" infoIcon={true} label="medium + icon" />
          </div>
        </div>
      </section>

      {/* 전체 조합 예제 */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>전체 조합 예제</h2>
          <p style={{ margin: 0, fontSize: 14, color: '#666' }}>실제 사용 시나리오에 맞는 다양한 조합 예제입니다.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Default Variant */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Default Variant</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 12,
                  alignItems: 'center',
                  padding: 16,
                  backgroundColor: '#f9f9f9',
                  borderRadius: 8,
                }}
              >
                <StatusTag variant="default" label="기본" />
                <StatusTag variant="default" emphasis="solid" badge={true} label="solid + badge" />
                <StatusTag variant="default" emphasis="subtle" badge={true} label="subtle + badge" />
                <StatusTag variant="default" infoIcon={true} label="infoIcon" />
                <StatusTag variant="default" count={10} label="count" />
                <StatusTag
                  variant="default"
                  size="small"
                  emphasis="solid"
                  badge={true}
                  infoIcon={true}
                  count={5}
                  label="전체"
                />
              </div>
            </div>
          </div>

          {/* Success Variant */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Success Variant</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 12,
                  alignItems: 'center',
                  padding: 16,
                  backgroundColor: '#f9f9f9',
                  borderRadius: 8,
                }}
              >
                <StatusTag variant="success" label="성공" />
                <StatusTag variant="success" emphasis="solid" badge={true} label="solid + badge" />
                <StatusTag variant="success" emphasis="subtle" badge={true} label="subtle + badge" />
                <StatusTag variant="success" infoIcon={true} count={20} label="infoIcon + count" />
                <StatusTag variant="success" size="small" emphasis="solid" badge={true} label="small + solid + badge" />
              </div>
            </div>
          </div>

          {/* Warning Variant */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Warning Variant</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 12,
                  alignItems: 'center',
                  padding: 16,
                  backgroundColor: '#f9f9f9',
                  borderRadius: 8,
                }}
              >
                <StatusTag variant="warning" label="경고" />
                <StatusTag variant="warning" emphasis="solid" badge={true} label="solid + badge" />
                <StatusTag variant="warning" emphasis="subtle" badge={true} label="subtle + badge" />
                <StatusTag variant="warning" size="small" infoIcon={true} label="small + infoIcon" />
                <StatusTag variant="warning" count={50} label="count" />
              </div>
            </div>
          </div>

          {/* Critical Variant */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Critical Variant</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 12,
                  alignItems: 'center',
                  padding: 16,
                  backgroundColor: '#f9f9f9',
                  borderRadius: 8,
                }}
              >
                <StatusTag variant="critical" label="심각" />
                <StatusTag variant="critical" emphasis="solid" badge={true} label="solid + badge" />
                <StatusTag variant="critical" emphasis="subtle" badge={true} label="subtle + badge" />
                <StatusTag variant="critical" size="xsmall" count={1} label="xsmall + count" />
                <StatusTag variant="critical" infoIcon={true} badge={true} label="infoIcon + badge" />
              </div>
            </div>
          </div>

          {/* Progress Variant */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Progress Variant</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>Primary Progress</h4>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 12,
                    alignItems: 'center',
                    padding: 16,
                    backgroundColor: '#f9f9f9',
                    borderRadius: 8,
                  }}
                >
                  <StatusTag variant="progress" progressType="primary" label="진행중" />
                  <StatusTag
                    variant="progress"
                    progressType="primary"
                    emphasis="solid"
                    badge={true}
                    label="solid + badge"
                  />
                  <StatusTag
                    variant="progress"
                    progressType="primary"
                    infoIcon={true}
                    count={50}
                    label="infoIcon + count"
                  />
                  <StatusTag
                    variant="progress"
                    progressType="primary"
                    size="small"
                    emphasis="solid"
                    badge={true}
                    label="small + solid + badge"
                  />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>Secondary Progress</h4>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 12,
                    alignItems: 'center',
                    padding: 16,
                    backgroundColor: '#f9f9f9',
                    borderRadius: 8,
                  }}
                >
                  <StatusTag variant="progress" progressType="secondary" label="진행중" />
                  <StatusTag
                    variant="progress"
                    progressType="secondary"
                    emphasis="solid"
                    badge={true}
                    label="solid + badge"
                  />
                  <StatusTag
                    variant="progress"
                    progressType="secondary"
                    size="small"
                    count={75}
                    label="small + count"
                  />
                  <StatusTag
                    variant="progress"
                    progressType="secondary"
                    emphasis="subtle"
                    badge={true}
                    infoIcon={true}
                    label="subtle + badge + icon"
                  />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>Tertiary Progress</h4>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 12,
                    alignItems: 'center',
                    padding: 16,
                    backgroundColor: '#f9f9f9',
                    borderRadius: 8,
                  }}
                >
                  <StatusTag variant="progress" progressType="tertiary" label="진행중" />
                  <StatusTag
                    variant="progress"
                    progressType="tertiary"
                    emphasis="subtle"
                    badge={true}
                    label="subtle + badge"
                  />
                  <StatusTag variant="progress" progressType="tertiary" infoIcon={true} label="infoIcon" />
                  <StatusTag
                    variant="progress"
                    progressType="tertiary"
                    size="xsmall"
                    emphasis="solid"
                    badge={true}
                    count={25}
                    label="전체 조합"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 사용 주의사항 */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>사용 주의사항</h2>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              padding: 16,
              backgroundColor: '#fff3cd',
              borderRadius: 8,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <strong style={{ fontSize: 14 }}>1. ProgressType은 progress variant일 때만 사용 가능</strong>
              <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
                variant가 'progress'가 아닐 때 progressType을 전달하면 타입 에러가 발생합니다.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <strong style={{ fontSize: 14 }}>2. Subtle emphasis는 badge가 필수</strong>
              <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
                emphasis가 'subtle'일 때는 반드시 badge={true}를 함께 사용해야 합니다.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <strong style={{ fontSize: 14 }}>3. Label은 필수 prop</strong>
              <p style={{ margin: 0, fontSize: 14, color: '#666' }}>label prop은 항상 제공해야 합니다.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
